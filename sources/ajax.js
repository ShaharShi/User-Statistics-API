function getServerAPI(url) {
    return $.ajax({
        url,
        method: 'GET',
    })
}