from chatbot.data import training_data
from chatbot.model import build_and_train_model, predict_answer, load_model

def chat(model,vectorizer,unique_answers):
    """Inicia el modelo de conversacíon"""
    print("\n Chat iniciado")
    while True:
        user = input("Tu: ").strip()
        if user.lower() in {"salir", "exit", "quit"}:
            print("Bot: ¡Hasta pronto!")
            break
        response = predict_answer(model, vectorizer, unique_answers, user)
        print("Bot: ", response)

    
def main():
    #Intentar cargar el modelo

    model, vectorizer, unique_answers = load_model()
   #Menu principal
    while True:
        print("\n=== 🤖 MENÚ PRINPAL DEL CHATBOT ===")
        print("1️⃣ chat con el modelo")
        print("2️⃣ Reentrenar el modelo")
        print("3️⃣ Salir")
        opcion = input("\n Elige una opción (1-3):").strip()
        if opcion == "1":
            if model is None:
                print("\n ⚠️No hay modelo entrenado. Entrenalo primero")
            else:
                chat(model, vectorizer, unique_answers)
        elif opcion == "2":
            print("\n 🔄️ Reentrenando el modelo con los nuevos datos:")
            model,vectorizer,unique_answers = build_and_train_model(training_data)
            print("👌 Modelo actualizado correctamente")
        elif opcion == "3":
            print("\n ¡Hasta luego!")
            break 
        else:
            print("\n ✖️ opción no valida. Intentalo de nuevo")
        
if __name__ == "__main__":
    main()
   
    
   

   
