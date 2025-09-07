import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
from numpy.linalg import norm
from dothatlac.models import PostImage

# Lazy load
_resnet = None
_transform = transforms.Compose([
    transforms.Resize((224, 224)), # ResNet requires this size
    transforms.ToTensor(), # convert to tensor to multidimensional array calculation
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]), # help input image to be compatible with model trained on ResNet
])

def get_model():
    global _resnet
    if _resnet is None:
        local_weights = "/Users/nhathung/.cache/torch/hub/checkpoints/resnet50-0676ba61.pth"
        model = models.resnet50()
        model.load_state_dict(torch.load(local_weights, map_location="cpu"))
        # Remove the last fully-connected layer
        _resnet = nn.Sequential(*list(model.children())[:-1])
        _resnet.eval()
    return _resnet

def image_extractor(img: Image.Image):
    model = get_model()
    tensor = _transform(img).unsqueeze(0)
    with torch.no_grad():
        features = model(tensor).squeeze().numpy()
    return features

def find_similar(query_vec, top_k=5): # top_k is the number of returned items
    similarities = []
    # Get all PostImage expect image_vector=null
    feature_db = PostImage.objects.exclude(image_vector__isnull=True)
    for obj in feature_db:
        vec = np.array(obj.image_vector)
        sim = np.dot(query_vec, vec) / (norm(query_vec) * norm(vec))

        if sim > 0.8:
            similarities.append({
                "id": obj.id,
                "post_id": obj.post_id,
                "image": obj.image if obj.image else None,
                "score": float(sim),
            })

    similarities.sort(key=lambda x: x["score"], reverse=True)
    return similarities[:top_k]
