import base64

def encode_to_basic64(email, password):
  """Codifica un correo electrónico y contraseña en Base64 para un encabezado Basic.

  Args:
    email: La dirección de correo electrónico.
    password: La contraseña.

  Returns:
    Una cadena codificada en Base64 lista para ser usada en un encabezado Basic.
  """

  # Combina el correo y la contraseña separados por dos puntos
  combined_string = f"{email}:{password}"

  # Codifica a Base64
  base64_bytes = base64.b64encode(combined_string.encode('utf-8'))
  base64_string = base64_bytes.decode('utf-8')

  return base64_string

# Ejemplo de uso:
email = "user1@example.com"
password = "password123"

encoded_string = encode_to_basic64(email, password)

print("Cadena codificada en Base64:", encoded_string)