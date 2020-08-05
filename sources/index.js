
$(() => {
    $('#getUsersByGenderBtn').on('click', async () => {
        $('#tablesContainer').html('<div class="lds-facebook"><div></div><div></div><div></div></div>')

        const users = await getUsersData()
        setTimeout(() => {
            drawByGender(users)
        }, Math.ceil(Math.random() * 2000));
    })
    $('#getUsersByCountriesBtn').on('click', async () => {
        $('#tablesContainer').html('<div class="lds-facebook"><div></div><div></div><div></div></div>')

        const users = await getUsersData()
        setTimeout(() => {
            drawByCountries(users)
        }, Math.ceil(Math.random() * 2000));
    })
})

async function getUsersData() {
    try {
        const response = await getServerAPI('https://randomuser.me/api/?results=50')
        const { results } = response

        return results;
    } catch (error) {
        console.error(error)
    }
}

function drawByGender(users) {
    $('#tablesContainer').empty();

    const filteredMales = _filterMales()
    const filteredFemales = _filterFemales()

    const tablesWrap = _getTableWrap()
    const malesTable = getTableByGender(filteredMales, 'Male')
    const femaleTable = getTableByGender(filteredFemales, 'Female')

    tablesWrap.append(malesTable, femaleTable)
    $('#tablesContainer').append(tablesWrap);

    function _filterMales() {
        return users.filter((user) => user.gender.toLowerCase() === 'male')
    }
    function _filterFemales() {
        return users.filter((user) => user.gender.toLowerCase() === 'female')
    }
    function _getTableWrap() {
        return $('<div></div>').attr('class', 'd-flex flex-row justify-content-center my-5 mx-2')
    }
}

function getTableByGender(filteredData, tableForGender) {
    const table = $('<table></table>').attr('class', 'table text-center table-bordered mr-2')
    const thead = $('<thead></thead>').attr('class', 'thead-dark')
    const headerRow = $(`<tr><th colspan="4">${filteredData.length} ${tableForGender} Users</th></tr>`)
    const bottomHeaderRow = $('<tr class="thead-light"><th>Full Name</th> <th>Age</th> <th>Country</th> <th>Email</th></tr>')
    const tbody = $('<tbody></tbody>')

    const userTR = filteredData.map((user) => {
        return _getUserTR(user)
    })
    
    thead.append(headerRow, bottomHeaderRow)
    tbody.append(...userTR)
    table.append(thead, tbody)
    
    return table;

    function _getUserTR(user) {
        const nameTD = _getUserTD(`${user.name.title} ${user.name.first} ${user.name.last}`)
        const ageTD = _getUserTD(user.dob.age)
        const countryTD = _getUserTD(user.location.country)
        const emailTD = _getUserTD(user.email)

        return $('<tr></tr>').append(nameTD, ageTD, countryTD, emailTD)

        function _getUserTD(partOfUserData) {
            return $(`<td>${partOfUserData}</td>`);
        }
    }
}

function drawByCountries(users) {
    $('#tablesContainer').empty();
    
    const countedContries = _countCountries(users)
    const countriesTable = getCountriesTable(countedContries)
    const tableWrap = $('<div></div>').attr('class', 'container mt-5')

    tableWrap.append(countriesTable)
    $('#tablesContainer').append(tableWrap)

    function _countCountries(users) {
        return users.reduce((countedContries, user) => {
            const { country } = user.location;
            const counter = countedContries[country] | 0;
            return {...countedContries, [country]:counter + 1};
        }, {});
    }
}

function getCountriesTable(countedCountries) {
    const table = $('<table></table>').attr('class', 'table text-center table-bordered mr-2')
    const thead = $('<thead> <th>Country</th> <th>Number of Users from the Country</th> </thead>').attr('class', 'thead-dark')
    const tbody = $('<tbody></tbody>')

    const TR = Object.entries(countedCountries).map((conutryInObj) => {
        return _getTR(conutryInObj)
    })

    tbody.append(...TR)
    table.append(thead, tbody)
    
    return table;

    function _getTR(country) {
        const tr = $('<tr></tr>');
        const countryTD = $(`<td>${country[0]}</td>`)
        const counterTD = $(`<td><b>${country[1]}</b> Users from this country</td>`)

        return tr.append(countryTD, counterTD)
    }
}