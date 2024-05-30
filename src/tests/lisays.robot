*** Settings ***
Library    SeleniumLibrary
Suite Setup    Open Browser    ${BASE_URL}    firefox
Suite Teardown    Close Browser

*** Variables ***
${BASE_URL}    http://localhost:5173
${NEW_ARTICLE_KEY}    testkey
${NEW_ARTICLE_AUTHOR}    test author
${NEW_ARTICLE_TITLE}    test title
${NEW_ARTICLE_JOURNAL}    test journal
${NEW_ARTICLE_YEAR}    2023
${NEW_ARTICLE_VOLUME}    test volume
${NEW_ARTICLE_PAGES}    22-45

*** Test Cases ***
Verify Form Submission
    [Documentation]    Test if form submission calls the parent function with correct parameters.
    Go To    ${BASE_URL}

    # tyhjentää tietokannan ennen testiä (tyhjennyspainikkeella)
    Click Button    xpath=//button[contains(text(), 'Tyhjennä tietokanta')]
    Sleep    2s

    # Täytä kaikki kentät oikein ja lisää artikkeli
    Input Text    id=key-input    ${NEW_ARTICLE_KEY}
    Input Text    id=author    ${NEW_ARTICLE_AUTHOR}
    Input Text    id=title    ${NEW_ARTICLE_TITLE}
    Input Text    id=journal    ${NEW_ARTICLE_JOURNAL}
    Input Text    id=year    ${NEW_ARTICLE_YEAR}
    Input Text    id=volume    ${NEW_ARTICLE_VOLUME}
    Input Text    id=pages    ${NEW_ARTICLE_PAGES}
    Click Button    id=lisaa-button

    # varmistetaan että artikkeli ilmestyy 
    Wait Until Page Contains    ${NEW_ARTICLE_KEY}. ${NEW_ARTICLE_AUTHOR}. (${NEW_ARTICLE_YEAR}).
    Wait Until Page Contains    ${NEW_ARTICLE_TITLE}.
    Wait Until Page Contains    ${NEW_ARTICLE_VOLUME}, ${NEW_ARTICLE_PAGES}.

Check Missing Fields Alert
    [Documentation]    Test if an alert is displayed and no new article is added when required fields are missing.
    Go To    ${BASE_URL}

    # Tyhjennä tietokanta ennen testiä
    # Click Button    xpath=//button[contains(text(), 'Tyhjennä tietokanta')]
    Sleep    2s

    # Haetaan artikkelien lukumäärä ennen testin suorittamista
    ${initial_articles} =    Get WebElements    xpath=//div[contains(@class, 'artikkelituloste')]
    ${initial_count} =    Get Length    ${initial_articles}

    # Yritetään lisätä artikkeli tyhjillä kentillä
    Click Button    id=lisaa-button

    # Käsittele varoitusikkuna (alert)
    Handle Alert    action=ACCEPT

    # varmistetaan että artikkelien lukumäärä pysyy samana
    ${new_articles} =    Get WebElements    xpath=//div[contains(@class, 'artikkelituloste')]
    ${new_count} =    Get Length    ${new_articles}
    Should Be Equal    ${new_count}    ${initial_count}
