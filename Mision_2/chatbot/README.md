# Guía de implementación del chatbot, supervisado
pip install numpy
pip install scikit-learn
pip gym==0.26.2
pip install gym-notices

crear el archivo  setup_nltk.py

```
import nltk

try:
    nltk.download('punkt')
    print("NLTK punkt descargado correctamente.")
except Exception as e:
    print("")
    print(f"Error al descargar NLTK punkt: {e}")
                            

```