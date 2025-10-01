"""
MedViT Streamlit Demo App
Simple medical image classification interface
"""

import streamlit as st
import torch
import torch.nn.functional as F
from PIL import Image
import numpy as np
from torchvision import transforms
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from MedViT import MedViT_small, MedViT_base, MedViT_large

# Page config
st.set_page_config(
    page_title="MedViT Demo",
    page_icon="🏥",
    layout="wide"
)

# Title
st.title("🏥 MedViT - Medical Image Classifier")
st.markdown("**A Robust Vision Transformer for Medical Image Classification**")
st.markdown("---")

# Define class labels for different datasets
CLASS_LABELS = {
    "PathMNIST (9 classes)": [
        "Adipose", "Background", "Debris", "Lymphocytes", 
        "Mucus", "Smooth Muscle", "Normal Colon Mucosa", 
        "Cancer-associated Stroma", "Colorectal Adenocarcinoma"
    ],
    "ChestMNIST (14 classes)": [
        "Atelectasis", "Cardiomegaly", "Effusion", "Infiltration",
        "Mass", "Nodule", "Pneumonia", "Pneumothorax",
        "Consolidation", "Edema", "Emphysema", "Fibrosis",
        "Pleural Thickening", "Hernia"
    ],
    "DermaMNIST (7 classes)": [
        "Actinic Keratoses", "Basal Cell Carcinoma", "Benign Keratosis",
        "Dermatofibroma", "Melanoma", "Melanocytic Nevi", "Vascular Lesions"
    ],
    "OCTMNIST (4 classes)": [
        "CNV", "DME", "Drusen", "Normal"
    ],
    "PneumoniaMNIST (2 classes)": [
        "Normal", "Pneumonia"
    ],
    "RetinaMNIST (5 classes)": [
        "No DR", "Mild", "Moderate", "Severe", "Proliferative DR"
    ],
    "BreastMNIST (2 classes)": [
        "Malignant", "Benign"
    ],
    "OrganMNIST (11 classes)": [
        "Bladder", "Femur-left", "Femur-right", "Heart", "Kidney-left",
        "Kidney-right", "Liver", "Lung-left", "Lung-right", "Spleen", "Pancreas"
    ],
    "Custom": []
}

# Sidebar
with st.sidebar:
    st.header("⚙️ Settings")
    
    model_type = st.selectbox(
        "Model",
        ["MedViT-Small", "MedViT-Base", "MedViT-Large"],
        index=2  # Default to MedViT-Large
    )
    
    dataset_type = st.selectbox(
        "Dataset Type",
        list(CLASS_LABELS.keys()),
        help="Select the dataset type for class labels"
    )
    
    # Set num_classes based on dataset selection
    if dataset_type == "Custom":
        num_classes = st.number_input(
            "Number of Classes",
            min_value=2,
            max_value=1000,
            value=10,
            help="Number of output classes for your dataset"
        )
        class_names = [f"Class {i}" for i in range(num_classes)]
    else:
        class_names = CLASS_LABELS[dataset_type]
        num_classes = len(class_names)
        st.info(f"📊 **{num_classes} classes** in {dataset_type}")
    
    image_size = st.slider(
        "Image Size",
        128, 384, 224, 32
    )
    
    st.markdown("---")
    st.markdown("### 📁 Load Checkpoint (Optional)")
    checkpoint_file = st.file_uploader(
        "Upload .pth file",
        type=['pth', 'pt']
    )
    
    st.markdown("---")
    st.info("""
    **Quick Start:**
    1. Select model variant
    2. Set number of classes
    3. Upload an image
    4. View predictions
    """)

@st.cache_resource
def load_model(model_name, n_classes, checkpoint_data=None):
    """Load MedViT model"""
    if model_name == "MedViT-Small":
        model = MedViT_small(num_classes=n_classes)
    elif model_name == "MedViT-Base":
        model = MedViT_base(num_classes=n_classes)
    else:
        model = MedViT_large(num_classes=n_classes)
    
    if checkpoint_data is not None:
        try:
            checkpoint = torch.load(checkpoint_data, map_location='cpu')
            if 'model' in checkpoint:
                model.load_state_dict(checkpoint['model'])
            elif 'state_dict' in checkpoint:
                model.load_state_dict(checkpoint['state_dict'])
            else:
                model.load_state_dict(checkpoint)
            st.success("✅ Checkpoint loaded successfully!")
        except Exception as e:
            st.error(f"❌ Error loading checkpoint: {e}")
    
    model.eval()
    return model

def preprocess_image(image, size):
    """Preprocess image for inference"""
    transform = transforms.Compose([
        transforms.Resize((size, size)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])
    
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    return transform(image).unsqueeze(0)

def predict(model, image_tensor, n_classes, class_names):
    """Run inference"""
    with torch.no_grad():
        outputs = model(image_tensor)
        probs = F.softmax(outputs, dim=1)
        confidence, pred_idx = torch.max(probs, 1)
    
    # Get top 5
    top_k = min(5, n_classes)
    top_probs, top_indices = torch.topk(probs, top_k, dim=1)
    
    results = []
    for idx, prob in zip(top_indices[0], top_probs[0]):
        idx_val = idx.item()
        class_label = class_names[idx_val] if idx_val < len(class_names) else f"Class {idx_val}"
        results.append({
            'class': class_label,
            'confidence': prob.item() * 100
        })
    
    return results

# Main content
col1, col2 = st.columns(2)

with col1:
    st.header("📤 Upload Image")
    uploaded_file = st.file_uploader(
        "Choose a medical image",
        type=['png', 'jpg', 'jpeg', 'bmp']
    )
    
    if uploaded_file:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded Image", use_container_width=True)
        
        st.markdown(f"""
        **Image Info:**
        - Size: {image.size[0]} × {image.size[1]}
        - Mode: {image.mode}
        """)

with col2:
    st.header("🔍 Predictions")
    
    if uploaded_file:
        # Load model
        checkpoint_data = None
        if checkpoint_file:
            checkpoint_data = checkpoint_file
        
        with st.spinner("Loading model..."):
            model = load_model(model_type, num_classes, checkpoint_data)
        
        # Predict
        with st.spinner("Analyzing..."):
            img_tensor = preprocess_image(image, image_size)
            results = predict(model, img_tensor, num_classes, class_names)
        
        # Display results
        st.markdown("### 🎯 Top Prediction")
        st.markdown(f"## **{results[0]['class']}**")
        st.markdown(f"### Confidence: **{results[0]['confidence']:.2f}%**")
        st.progress(results[0]['confidence'] / 100)
        
        st.markdown("---")
        st.markdown("### 📊 Top 5 Predictions")
        
        for i, result in enumerate(results, 1):
            col_a, col_b = st.columns([3, 1])
            with col_a:
                st.markdown(f"**{i}. {result['class']}**")
            with col_b:
                st.markdown(f"**{result['confidence']:.2f}%**")
            st.progress(result['confidence'] / 100)
    else:
        st.info("👆 Upload an image to start")

# Footer
st.markdown("---")
with st.expander("ℹ️ About MedViT"):
    st.markdown("""
    **MedViT** is a CNN-Transformer hybrid model for robust medical image classification.
    
    **Key Features:**
    - Efficient convolutional attention mechanism
    - High robustness against adversarial attacks
    - State-of-the-art performance on MedMNIST datasets
    
    **Paper:** [arXiv:2302.09462](https://arxiv.org/abs/2302.09462)  
    **GitHub:** [Omid-Nejati/MedViT](https://github.com/Omid-Nejati/MedViT)
    """)

with st.expander("🚀 How to Use"):
    st.markdown("""
    1. **Configure Model**: Select model size and set number of classes
    2. **Load Weights** (Optional): Upload a pretrained checkpoint file
    3. **Upload Image**: Choose a medical image file
    4. **View Results**: See predictions and confidence scores
    
    **Note:** Without a trained checkpoint, the model will use random weights.
    Download pretrained weights from the [GitHub repo](https://github.com/Omid-Nejati/MedViT).
    """)
