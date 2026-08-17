from PIL import Image

import pytesseract



def extract_image_text(
        image_path:str
):

    image = Image.open(
        image_path
    )


    text = pytesseract.image_to_string(
        image
    )


    return text