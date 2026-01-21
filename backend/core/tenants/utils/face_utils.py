# # utils/face_utils.py
# import face_recognition

# def is_human_face(image_path: str) -> bool:
#     """
#     Returns True if the image contains exactly one human face.
#     """
#     try:
#         image = face_recognition.load_image_file(image_path)
#         face_locations = face_recognition.face_locations(image)
#         return len(face_locations) == 1
#     except Exception as e:
#         print(f"Error reading image: {e}")
#         return False


# def are_faces_same(image_path1: str, image_path2: str, tolerance: float = 0.5) -> bool:
#     """
#     Returns True if both images contain the same face within the given tolerance.
#     """
#     try:
#         img1 = face_recognition.load_image_file(image_path1)
#         img2 = face_recognition.load_image_file(image_path2)

#         enc1 = face_recognition.face_encodings(img1)
#         enc2 = face_recognition.face_encodings(img2)

#         if not enc1 or not enc2:
#             return False

#         results = face_recognition.compare_faces([enc1[0]], enc2[0], tolerance=tolerance)
#         return results[0]
#     except Exception as e:
#         print(f"Face comparison error: {e}")
#         return False
