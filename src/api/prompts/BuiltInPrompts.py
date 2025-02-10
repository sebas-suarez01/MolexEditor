from prompts.SystemPrompt import SystemPrompt
from prompts.UserPrompt import UserPrompt


class SystemGenerateTextPrompt(SystemPrompt):
    GENERATE_TEXT_PROMPT = """
    Eres un modelo de lenguaje avanzado, especializado en generar respuestas detalladas, claras y organizadas. Al responder, sigue estas pautas:

    Claridad y precisión: Sé directo pero explicativo, asegurándote de que cada oración contribuya al contexto general.
    Cohesión: Relaciona cada párrafo y cada idea entre sí, para que la respuesta fluya naturalmente. Usa conectores lógicos.
    Coherencia: Mantén una estructura clara: inicia con una introducción breve, desarrolla el contenido en un orden lógico, y concluye con un cierre que resuma los puntos clave.
    Ejemplos y detalles: Donde sea relevante, incluye ejemplos o explicaciones concretas para ilustrar tus puntos.
    Adecuación al contexto: Ajusta el tono y el nivel de detalle de la respuesta según las necesidades del usuario.
    """

    def __init__(self):
        prompt = self.GENERATE_TEXT_PROMPT
        super().__init__(prompt=prompt)

class UserSummarizePrompt(UserPrompt):
    SUMMARIZE_PROMPT = """Por favor, resume el siguiente texto de manera clara, concisa y estructurada, \n
                        manteniendo un enfoque académico y científico. El resumen debe conservar los puntos clave, \n
                        evitando información irrelevante o redundante, y debe emplear un tono formal, técnico y preciso. \n
                        El resultado debe estar organizado de forma lógica, con una redacción adecuada para un público experto en el tema. \n
                        Asegúrate de que el contenido sea coherente y libre de ambigüedades. \n
                        Texto a resumir: {text}. \n
                        Solo responde con el resultado del texto resumido"""

    def __init__(self, text):
        prompt = self.SUMMARIZE_PROMPT.format(text=text)
        super().__init__(prompt=prompt)

class UserTextIncludePrompt(UserPrompt):
    TEXT_INCLUDE_PROMPT = """{prompt} 
                    Responde utilizando este texto como contexto.
                    Texto :{text}."""

    def __init__(self, prompt, text):
        prompt = self.TEXT_INCLUDE_PROMPT.format(prompt=prompt, text=text)
        super().__init__(prompt=prompt)

class UserTopicPrompt(UserPrompt):
    TOPIC_PROMPT = """Por favor, extrae y proporciona solo la temática principal de este texto. 
                    Responde únicamente con el tema central, sin explicaciones adicionales.
                    Texto a analizar:{text}."""

    def __init__(self, text):
        prompt = self.TOPIC_PROMPT.format(text=text)
        super().__init__(prompt=prompt)

class UserLanguageDetectPrompt(UserPrompt):
    LANG_DETECT_PROMPT = """Por favor, determina el idioma del siguiente texto. Proporciona solo el nombre del idioma, 
                        sin explicaciones adicionales.
                        Texto a analizar:{text}."""

    def __init__(self, text):
        prompt = self.LANG_DETECT_PROMPT.format(text=text)
        super().__init__(prompt=prompt)

class UserCheckPrompt(UserPrompt):
    CHECK_PROMPT = """Por favor, realiza las siguientes acciones sobre el siguiente texto:
                    Acciones a realizar: {actions}
                    Devuelve únicamente el texto modificado, sin explicaciones adicionales.
                    Texto a modificar: {text}."""

    def __init__(self, text, actions):
        prompt = self.CHECK_PROMPT.format(text=text, actions=actions)
        super().__init__(prompt=prompt)

class UserCheckCitationPrompt(UserPrompt):
    CHECK_CITATION_PROMPT = """Por favor, dado el siguiente contexto de documentos
                    
                    Contexto en el formato [cite]-Text:
                    {context_texts}
                    
                    y el siguiente texto:
                    {text}
                    
                    Revisa si algo de lo expresado en el texto necesita una cita en texto basado en los documentos 
                    aportados en el contexto. Devuelve solamente el texto con las cita en texto necesarias con el 
                    formato [cite]
                    """

    def __init__(self, text, related_docs):
        context_texts = "\n".join(
            [f"[{doc.metadata['source']}]-{doc.page_content}" for i, doc in enumerate(related_docs)]
        )
        prompt = self.CHECK_CITATION_PROMPT.format(text=text, context_texts=context_texts)
        super().__init__(prompt=prompt)

INITIAL_REFERENCE_PROMPT = """Por favor, genera la referencia y la cita en texto del siguiente {type_ref} utilizando el siguiente formato.
                Si algún dato está vacío, no lo incluyas en la construcción de la referencia o la cita en texto.

                Formato de la referencia: {reference} \n"""

END_REFERENCE_PROMPT ="""
                Instrucciones:
                Devuelve solo la referencia y la cita en texto, de la siguiente manera:
                Referencia: [Respuesta de referencia]
                Cita en texto: [Respuesta cita en texto]
                """

class UserBookReferencePrompt(UserPrompt):
    BOOK_REFERENCE_PROMPT = INITIAL_REFERENCE_PROMPT +  """
                Datos del libro:

                Título: {title}
                Autor(es): {authors}
                Año de publicación: {publish_year}
                Editorial: {publisher}
                Titulo del Capítulo: {chapter_title}
                Páginas: {pages}""" + END_REFERENCE_PROMPT

    def __init__(self, title, authors, publish_year, publisher, reference, chapter_title="", pages=""):
        prompt = self.BOOK_REFERENCE_PROMPT.format(type_ref='libro',
                                                   title=title,
                                                   authors=authors,
                                                   publish_year=publish_year,
                                                   publisher=publisher,
                                                   reference=reference,
                                                   chapter_title=chapter_title,
                                                   pages=pages)
        super().__init__(prompt=prompt)

class UserArticleReferencePrompt(UserPrompt):
    ARTICLE_REFERENCE_PROMPT = INITIAL_REFERENCE_PROMPT + """
                Datos del articulo:

                Título: {title}
                Autor(es): {authors}
                Año de publicación: {publish_year}
                Nombre de la revista: {journal}
                Volumen: {volume}
                Número: {issue}
                Páginas: {pages}
                DOI: {doi}
                """ + END_REFERENCE_PROMPT

    def __init__(self, title, authors, publish_year, journal, reference, volume, issue, pages, doi):
        prompt = self.ARTICLE_REFERENCE_PROMPT.format(type_def='articulo',
                                                      title=title,
                                                      authors=authors,
                                                      publish_year=publish_year,
                                                      journal=journal,
                                                      reference=reference,
                                                      volume=volume,
                                                      issue=issue,
                                                      pages=pages,
                                                      doi=doi)
        super().__init__(prompt=prompt)

class UserWebSiteReferencePrompt(UserPrompt):
    WEBSITE_REFERENCE_PROMPT = INITIAL_REFERENCE_PROMPT + """
                Datos del sitio web:

                Título: {title}
                Autor(es): {authors}
                Año de publicación: {publish_year}
                Nombre del sitio web: {website_name}
                URL: {url}
                """ + END_REFERENCE_PROMPT

    def __init__(self, title, authors, publish_year, website_name, reference, url):
        prompt = self.WEBSITE_REFERENCE_PROMPT.format(type_def='sitio web',
                                                      title=title,
                                                      authors=authors,
                                                      publish_year=publish_year,
                                                      website_name=website_name,
                                                      reference=reference,
                                                      url=url)
        super().__init__(prompt=prompt)

class UserReportReferencePrompt(UserPrompt):
    REPORT_REFERENCE_PROMPT = INITIAL_REFERENCE_PROMPT + """
                Datos del informe:

                Título: {title}
                Autor(es): {authors}
                Año de publicación: {publish_year}
                Editorial: {publisher}
                URL: {url}
                """ + END_REFERENCE_PROMPT

    def __init__(self, title, authors, publish_year, publisher, reference, url):
        prompt = self.REPORT_REFERENCE_PROMPT.format(type_def='informe',
                                                      title=title,
                                                      authors=authors,
                                                      publish_year=publish_year,
                                                      publisher=publisher,
                                                      reference=reference,
                                                      url=url)
        super().__init__(prompt=prompt)

class UserExtendTextInLineCitations(UserPrompt):
    EXTEND_TEXT_IN_LINE_CITATION_PROMPT = """
        Dado el siguiente contexto:

        Contexto en el formato [cite]-Text:
        {context_texts}

        y el siguiente texto:
        Texto:
        {text}
        
        Instrucciones:
        
        1.Extiénde el texto proporcionado, utilizando un lenguaje formal, con una escritura clara, 
        precisa y concisa, tomando los documentos pasados en el contexto como referencia. Amplía las ideas originales 
        respetando su intención, aportando detalles adicionales, elaboraciones contextuales y ejemplos relevantes cuando sea apropiado.
        2. Asegúrate de mantener la coherencia, el tono formal y la calidad del texto original.
        3. Cada afirmación relacionada con los documentos de contexto debe incluir una cita textual indicando la fuente 
        correspondiente en el formato [cite]. 
        4. Si la información no está disponible en los documentos, indícalo explícitamente. No añadas contenido adicional
        que necesite ser respaldado.
        5. Solo responde con el texto resultante.

     """

    def __init__(self, related_docs, text):
        context_texts = "\n".join(
            [f"[{doc.metadata['source']}]-{doc.page_content}" for i, doc in enumerate(related_docs)]
        )

        prompt = self.EXTEND_TEXT_IN_LINE_CITATION_PROMPT.format(context_texts=context_texts, text=text)
        super().__init__(prompt=prompt)

class UserArXivInLineReferencePrompt(UserPrompt):
    ARXIV_IN_LINE_REFERENCE_PROMPT = """Por favor, genera la cita en texto del siguiente articulo de arxiv utilizando el siguiente formato.
                Si algún dato está vacío, no lo incluyas en la construcción de la referencia o la cita en texto.

                Formato de la referencia: {reference} \n
                
                Datos del articulo de arvix:

                Autor(es): {authors}
                Año de publicación: {publish_year}
                
                Si tiene mas de 2 autores excluyelos de la cita en texto y solo toma los dos primeros. Devuelve solo la cita en texto.
                """

    def __init__(self, authors, publish_year, reference):
        prompt = self.ARXIV_IN_LINE_REFERENCE_PROMPT.format(authors=authors, publish_year=publish_year, reference=reference)
        super().__init__(prompt=prompt)
