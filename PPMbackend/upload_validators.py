from django.core.exceptions import ValidationError
from PIL import Image, UnidentifiedImageError

MAX_IMAGE_SIZE_BYTES = 450 * 1024
MAX_IMAGE_WIDTH = 1600
MAX_IMAGE_HEIGHT = 1600


def validate_small_image(uploaded_file):
    if not uploaded_file:
        return uploaded_file

    if uploaded_file.size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError(
            f"L'immagine deve pesare al massimo {MAX_IMAGE_SIZE_BYTES // 1024} KB."
        )

    try:
        uploaded_file.seek(0)
        image = Image.open(uploaded_file)
        image.verify()
        uploaded_file.seek(0)
        image = Image.open(uploaded_file)
        width, height = image.size
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValidationError('Carica un file immagine valido.') from exc
    finally:
        try:
            uploaded_file.seek(0)
        except (AttributeError, OSError):
            pass

    if width > MAX_IMAGE_WIDTH or height > MAX_IMAGE_HEIGHT:
        raise ValidationError(
            f"L'immagine deve avere dimensioni massime {MAX_IMAGE_WIDTH}x{MAX_IMAGE_HEIGHT} pixel."
        )

    return uploaded_file
