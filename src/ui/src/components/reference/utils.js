//APA


// APA 7ma: Libro
function apa7Book(author, year, title, publisher) {
    return `${author} (${year}). *${title}*. ${publisher}.`;
}

// APA 7ma: Artículo de revista
function apa7JournalArticle(author, year, title, journal, volume, issue, pages, doi) {
    return `${author} (${year}). ${title}. *${journal}*, ${volume}(${issue}), ${pages}. https://doi.org/${doi}`;
}

// APA 7ma: Capítulo de un libro
function apa7BookChapter(author, year, title, editor, bookTitle, pages, publisher) {
    return `${author} (${year}). ${title}. En ${editor} (Ed.), *${bookTitle}* (pp. ${pages}). ${publisher}.`;
}

// APA 7ma: Sitio web
function apa7Website(author, year, title, url) {
    return `${author} (${year}). ${title}. Recuperado de ${url}`;
}

// APA 7ma: Informe
function apa7Report(author, year, title, publisher, url) {
    return `${author} (${year}). *${title}*. ${publisher}. ${url ? `Recuperado de ${url}` : ''}`;
}



//MLA




// MLA 9na: Libro
function mla9Book(author, title, publisher, year) {
    return `${author}. *${title}*. ${publisher}, ${year}.`;
}

// MLA 9na: Artículo de revista
function mla9JournalArticle(author, title, journal, volume, issue, year, pages, doi) {
    return `${author}. "${title}." *${journal}*, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}. https://doi.org/${doi}`;
}

// MLA 9na: Capítulo de un libro
function mla9BookChapter(author, title, editor, bookTitle, publisher, year, pages) {
    return `${author}. "${title}." *${bookTitle}*, editado por ${editor}, ${publisher}, ${year}, pp. ${pages}.`;
}

// MLA 9na: Sitio web
function mla9Website(author, title, siteName, url, accessDate) {
    return `${author}. "${title}." *${siteName}*, ${url}. Consultado el ${accessDate}.`;
}

// MLA 9na: Informe
function mla9Report(author, title, publisher, year, url) {
    return `${author}. *${title}*. ${publisher}, ${year}. ${url}`;
}



//Chicago


// Chicago: Libro
function chicagoBook(author, title, publisher, year) {
    return `${author}. *${title}*. ${publisher}, ${year}.`;
}

// Chicago: Artículo de revista
function chicagoJournalArticle(author, title, journal, volume, issue, year, pages, doi) {
    return `${author}. "${title}." *${journal}* ${volume}, no. ${issue} (${year}): ${pages}. https://doi.org/${doi}`;
}

// Chicago: Capítulo de un libro
function chicagoBookChapter(author, title, editor, bookTitle, pages, publisher, year) {
    return `${author}. "${title}." En *${bookTitle}*, editado por ${editor}, ${pages}. ${publisher}, ${year}.`;
}

// Chicago: Sitio web
function chicagoWebsite(author, title, siteName, url, accessDate) {
    return `${author}. "${title}." *${siteName}*. Última consulta el ${accessDate}. ${url}`;
}

// Chicago: Informe
function chicagoReport(author, title, publisher, year, url) {
    return `${author}. *${title}*. ${publisher}, ${year}. ${url}`;
}



//Vancouver



// Vancouver: Libro
function vancouverBook(author, title, publisher, year) {
    return `${author}. ${title}. ${publisher}; ${year}.`;
}

// Vancouver: Artículo de revista
function vancouverJournalArticle(author, title, journal, year, volume, issue, pages, doi) {
    return `${author}. ${title}. ${journal}. ${year};${volume}(${issue}):${pages}. doi:${doi}`;
}

// Vancouver: Capítulo de un libro
function vancouverBookChapter(author, title, editor, bookTitle, pages, publisher, year) {
    return `${author}. ${title}. In: ${editor}, editor. ${bookTitle}. ${publisher}; ${year}. p. ${pages}.`;
}

// Vancouver: Sitio web
function vancouverWebsite(author, title, url, accessDate) {
    return `${author}. ${title}. [Internet]. Available from: ${url}. Accessed: ${accessDate}.`;
}

// Vancouver: Informe
function vancouverReport(author, title, publisher, year, url) {
    return `${author}. ${title}. ${publisher}; ${year}. Available from: ${url}`;
}



//Harvard



// Harvard: Libro
function harvardBook(author, year, title, publisher) {
    return `${author} (${year}) *${title}*. ${publisher}.`;
}

// Harvard: Artículo de revista
function harvardJournalArticle(author, year, title, journal, volume, issue, pages, doi) {
    return `${author} (${year}) '${title}', *${journal}*, ${volume}(${issue}), pp. ${pages}. doi:${doi}`;
}

// Harvard: Capítulo de un libro
function harvardBookChapter(author, year, title, editor, bookTitle, pages, publisher) {
    return `${author} (${year}) '${title}', in ${editor} (ed.) *${bookTitle}*. ${publisher}, pp. ${pages}.`;
}

// Harvard: Sitio web
function harvardWebsite(author, year, title, url, accessDate) {
    return `${author} (${year}) '${title}', available at: ${url} (Accessed: ${accessDate}).`;
}

// Harvard: Informe
function harvardReport(author, year, title, publisher, url) {
    return `${author} (${year}) *${title}*. ${publisher}. Available at: ${url}`;
}



//IEEE



// IEEE: Libro
function ieeeBook(author, title, publisher, year) {
    return `${author}, *${title}*. ${publisher}, ${year}.`;
}

// IEEE: Artículo de revista
function ieeeJournalArticle(author, title, journal, volume, issue, pages, year, doi) {
    return `${author}, "${title}," *${journal}*, vol. ${volume}, no. ${issue}, pp. ${pages}, ${year}. doi:${doi}`;
}

// IEEE: Capítulo de un libro
function ieeeBookChapter(author, title, editor, bookTitle, pages, publisher, year) {
    return `${author}, "${title}," in *${bookTitle}*, ${editor}, Ed. ${publisher}, ${year}, pp. ${pages}.`;
}

// IEEE: Sitio web
function ieeeWebsite(author, title, siteName, url, accessDate) {
    return `${author}, "${title}," ${siteName}, ${url} (accessed ${accessDate}).`;
}

// IEEE: Informe
function ieeeReport(author, title, publisher, year, url) {
    return `${author}, *${title}*. ${publisher}, ${year}. [Online]. Available: ${url}`;
}
