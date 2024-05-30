*** Settings ***
Documentation     Testaa BibTeX-tiedoston lataustoimintoa.
Library           SeleniumLibrary

Suite Setup       Avaa Selain Sovellukseen
Suite Teardown    Sulje Selain

*** Variables ***
${URL}            http://localhost:5173   # Oletetaan, että React-sovelluksesi on tässä osoitteessa

*** Test Cases ***
Testaa Bibtex Tiedoston Lataaminen
    [Documentation]    Testaa, että BibTeX-tiedoston latausnappi toimii oikein.
    Avaa Sovelluksen Etusivu
    Paina Latausnappia
    # Tässä kohtaa todellinen tiedoston latauksen varmistaminen vaatisi lisäkonfiguraatiota.

*** Keywords ***
Avaa Selain Sovellukseen
    Open Browser    ${URL}    browser=chrome

Avaa Sovelluksen Etusivu
    ${current_url}=    Get Location
    Should Be True    '${current_url}' == '${URL}' or '${current_url}' == '${URL}/'
    Wait Until Page Contains    Lisää artikkeli

Paina Latausnappia
    Click Button    xpath://button[text()='Lataa BibTeX-tiedosto']
    # Odotetaan, että nappi on painettavissa ja interaktiivinen
    Wait Until Element Is Visible    xpath://button[text()='Lataa BibTeX-tiedosto']
    Click Element    xpath://button[text()='Lataa BibTeX-tiedosto']

Sulje Selain
    Close Browser
