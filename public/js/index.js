window.onload = function() {
    let fc_submit = document.getElementById('fc_submit');
    let fc_url = document.getElementById('fc_url');

    fc_submit.addEventListener('click', async function() {
        console.log(fc_url.value);
        axios({
                method: 'post',
                url: '/api/url',
                data: {
                    url: fc_url.value
                }
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            })
    });
}