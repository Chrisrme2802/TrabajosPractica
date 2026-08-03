"""
Proyecto 1: Hand Tracking + Reconocimiento de Gestos
------------------------------------------------------

Qué aprenderás aquí:
1. Cómo leer video de la cámara con OpenCV.
2. Cómo obtener landmarks (puntos clave) de la mano con MediaPipe.
3. Cómo convertir esos puntos en reglas geométricas para detectar gestos.

MediaPipe te da 21 puntos por mano, indexados así (memorízalos, los vas a usar mucho):
  0 = muñeca
  4 = punta del pulgar       (1,2,3 son las articulaciones del pulgar)
  8 = punta del índice       (5,6,7 son sus articulaciones)
  12 = punta del medio       (9,10,11)
  16 = punta del anular      (13,14,15)
  20 = punta del meñique     (17,18,19)

La idea de "dedo extendido" es simple: comparamos la posición Y de la
punta del dedo contra la posición Y de su nudillo (el punto 2 antes de
la punta). Si la punta está MÁS ARRIBA (Y menor) que el nudillo, el
dedo está extendido. El pulgar es distinto porque se mueve en X, no en Y.
"""

import cv2
import mediapipe as mp
import math

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Índices de los landmarks que nos interesan para cada dedo:
# (punta, nudillo_de_referencia)
FINGER_TIPS_AND_PIPS = {
    "index": (8, 6),
    "middle": (12, 10),
    "ring": (16, 14),
    "pinky": (20, 18),
}


def fingers_up(hand_landmarks, handedness_label):
    """
    Devuelve una lista de 5 booleanos: [pulgar, índice, medio, anular, meñique]
    True = dedo extendido.
    """
    lm = hand_landmarks.landmark
    fingers = []

    # Pulgar: se mueve en X. Si la mano es la derecha, el pulgar extendido
    # tiene su punta (4) más a la IZQUIERDA que su articulación (3).
    # Si es la mano izquierda, es al revés. MediaPipe ya nos dice qué mano es.
    if handedness_label == "Right":
        fingers.append(lm[4].x < lm[3].x)
    else:
        fingers.append(lm[4].x > lm[3].x)

    # Los otros 4 dedos: comparamos Y (en imagen, Y crece hacia abajo,
    # por eso "extendido" = punta.y < nudillo.y)
    for name, (tip, pip) in FINGER_TIPS_AND_PIPS.items():
        fingers.append(lm[tip].y < lm[pip].y)

    return fingers


def classify_gesture(fingers, lm):
    """
    Reglas simples sobre el patrón de dedos levantados.
    fingers = [pulgar, índice, medio, anular, meñique] (booleanos)
    Esto es EXACTAMENTE el tipo de lógica que quieres empezar a inventar tú:
    agrega tus propios gestos aquí.
    """
    total = sum(fingers)
    p1 = [lm[4].x, lm[4].y]
    p2 = [lm[8].x, lm[8].y]
    pinch_dist = math.dist(p1, p2)

    if pinch_dist < 0.05 and fingers == [True, False, True, True, True]:
        return "OK"
    if fingers == [False, False, False, False, False]:
        return "Puño cerrado"
    if fingers == [True, True, True, True, True]:
        return "Mano abierta"
    if fingers == [False, True, True, False, False]:
        return "Paz / Victoria"
    if fingers == [True, False, False, False, False]:
        return "Pulgar arriba"
    if fingers == [False, True, False, False, False]:
        return "Apuntando"
    return f"Gesto desconocido ({total} dedos arriba)"


def main():
    cap = cv2.VideoCapture(0)

    try :
        with mp_hands.Hands(
        model_complexity=1,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.5,
        max_num_hands=2,
        ) as hands:

            while cap.isOpened():
                ok, frame = cap.read()
                if not ok:
                    break

                # MediaPipe espera RGB, OpenCV lee en BGR
                frame = cv2.flip(frame, 1)  # efecto espejo, más natural
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = hands.process(rgb)

                if results.multi_hand_landmarks:
                    for hand_landmarks, handedness in zip(
                        results.multi_hand_landmarks, results.multi_handedness
                    ):
                        label = handedness.classification[0].label  # "Left"/"Right"

                        mp_drawing.draw_landmarks(
                            frame, hand_landmarks, mp_hands.HAND_CONNECTIONS
                        )

                        lm = hand_landmarks.landmark
                        fingers = fingers_up(hand_landmarks, label)
                        gesture = classify_gesture(fingers, lm)

                        # Mostramos el gesto detectado cerca de la muñeca
                        h, w, _ = frame.shape
                        wrist_x = int(hand_landmarks.landmark[0].x * w)
                        wrist_y = int(hand_landmarks.landmark[0].y * h)
                        cv2.putText(
                            frame, gesture, (wrist_x - 50, wrist_y + 40),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2
                        )

                cv2.imshow("Hand Gestures - presiona q para salir", frame)
                if cv2.waitKey(5) & 0xFF == ord("q"):
                    break
    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()