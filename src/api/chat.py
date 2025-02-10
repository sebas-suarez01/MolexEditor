import requests_models

URL_CHAT = 'http://127.0.0.1:1234/v1/chat/completions'


#Response with memory
messages =[
    {"role": "system", "content": "Usted es el redactor de una empresa tecnologica. Esta revisando un documento para comprobar si cumple con la guia de estilo de la empresa." },
    {"role": "assistant", "content": "Hola soy Leditor, su compañero de escritura. En que puedo ayudarte?" },
    {"role": "user", "content": "Revisa, localizame y dime las faltas ortograficas y la grammatica de este parrafo: Ayer yo vi un perro corriendo atras de su cola en la calle, era tan gracioso que no pude pararme de rier. Un niño trato de atraparlo pero el perro era muy rapido y se metio en unos arbustos. Luego el niño dejo su sombrero en la banqueta y se fue a su casa, el sombrero volo con el viento. Fue un dia muy estraño. " }
]
