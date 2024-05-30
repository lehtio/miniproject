*** Settings ***
Library    SeleniumLibrary
Suite Setup    Open Browser    http://localhost:5173    firefox
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
Verify Single Article Printing
    [Documentation]    Test if adding a single article prints it to the site.
    Go To    ${BASE_URL}
    Input Text    id=key-input    ${NEW_ARTICLE_KEY}
    Input Text    id=author    ${NEW_ARTICLE_AUTHOR}
    Input Text    id=title    ${NEW_ARTICLE_TITLE}
    Input Text    id=journal    ${NEW_ARTICLE_JOURNAL}
    Input Text    id=year    ${NEW_ARTICLE_YEAR}
    Input Text    id=volume    ${NEW_ARTICLE_VOLUME}
    Input Text    id=pages    ${NEW_ARTICLE_PAGES}
    Click Button    id=lisaa-button

    # varmistaa että artikkeli tulostuu 
    Wait Until Page Contains    ${NEW_ARTICLE_KEY}. ${NEW_ARTICLE_AUTHOR}. (${NEW_ARTICLE_YEAR}).
    Wait Until Page Contains    ${NEW_ARTICLE_TITLE}.
    Wait Until Page Contains    ${NEW_ARTICLE_VOLUME}, ${NEW_ARTICLE_PAGES}.

Verify Multiple Articles Printing
    [Documentation]    Test if adding multiple articles prints them to the site.
    Go To    ${BASE_URL}
    FOR    ${i}    IN RANGE    2
        Input Text    id=key-input    testkey${i}
        Input Text    id=author    test author${i}
        Input Text    id=title    test title${i}
        Input Text    id=journal    test journal${i}
        Input Text    id=year    ${NEW_ARTICLE_YEAR}
        Input Text    id=volume    test volume${i}
        Input Text    id=pages    ${NEW_ARTICLE_PAGES}
        Click Button    id=lisaa-button
    END

    # Varmista että molemmat artikkelit tulostuvat käyttöliittymään
    FOR    ${i}    IN RANGE    2
        Wait Until Page Contains    testkey${i}. test author${i}. (${NEW_ARTICLE_YEAR}).
        Wait Until Page Contains    test title${i}.
        Wait Until Page Contains    test volume${i}, ${NEW_ARTICLE_PAGES}.
    END
