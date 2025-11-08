import nltk

try:
    nltk.download('punkt')
    print("NLTK punkt descargado correctamente.")
except Exception as e:
    print("")
    print(f"Error al descargar NLTK punkt: {e}")


