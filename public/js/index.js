let converter = new showdown.Converter();

window.onload = function() {
    // let fc_submit = document.getElementById('fc_submit');
    // let fc_url = document.getElementById('fc_url');

    // fc_submit.addEventListener('click', async function() {
    //     console.log(fc_url.value);
    // axios({
    //         method: 'post',
    //         url: '/api/url',
    //         data: {
    //             url: fc_url.value
    //         }
    //     })
    //     .then(function(response) {
    //         console.log(response);
    //     })
    //     .catch(function(error) {
    //         console.log(error);
    //     })
    // });

    const search = document.querySelector(".search-bar-container");
    const magnifier = document.querySelector(".magnifier");
    const micIcon = document.querySelector(".mic-icon");
    const input = document.querySelector(".input");
    const listItem = document.querySelector(".voice-text");
    const recognition = new webkitSpeechRecognition() || SpeechRecognition();
    const analysistext = document.querySelector(".analysis-text");

    // analysistext.innerHTML = `<p>Based on the information provided earlier from the McKinsey Global Institute (MGI) report, the article's key points on the impact of AI on US jobs by 2030 present some conflicting information:</p>
    // <ol>
    // <li><p><strong>Article Claim - AI Will Replace 2.4 Million US Jobs by 2030:</strong>
    // The article states that Forrester predicts 2.4 million US jobs will be replaced by generative AI by 2030. This is a specific figure that doesn't match the information given from the MGI report, which did not mention a number of jobs being replaced but instead focused on the potential shift and transformation in job categories due to automation and generative AI.</p></li>
    // <li><p><strong>Article Claim - Job Replacement Focus on High-salary Jobs:</strong>
    // According to the article, those with salaries over $90,000 are the most likely to have their jobs replaced. This is contrary to the MGI report, which states that workers in lower-wage jobs are up to 14 times more likely to need to change occupations than those in the highest-wage positions.</p></li>
    // <li><p><strong>Article Claim - Blue-collar Professions Virtually Untouched:</strong>
    // The article suggests that blue-collar professions in construction and transportation may remain virtually untouched. The MGI report does not entirely support this claim, as it states that infrastructure projects will increase demand for construction, impacting the job market positively, and there will be gains in transportation services due to e-commerce growth. It's not implied that these sectors are immune to changes brought by AI and automation.</p></li>
    // <li><p><strong>Article Claim - Creative Fields Using AI:</strong>
    // The article claims that Forrester found that artistic fields are more likely to incorporate AI into their current roles. While the MGI report doesn't directly contradict this claim, it suggests that creative roles may be enhanced by generative AI rather than being replaced.</p></li>
    // </ol>
    // <p>In conclusion, while the article touches upon some trends consistent with the MGI report regarding AI's impact on jobs, it also presents several specific claims that either are not supported or directly contradict the information provided in the MGI report. The MGI report emphasizes that AI will more likely transform jobs than replace them outright and that lower-wage workers may need to transition more than higher-wage workers, a point at odds with the article's specific focus on job replacement among higher earners.</p>`;

    analysistext.addEventListener("change", (e) => {
        // auto resize textarea
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    // analysistext.style.height = 'auto';
    // analysistext.style.height = analysistext.scrollHeight + 'px';
    // window.scrollTo(0, 30 * getVH(), {
    //     behavior: 'smooth'
    // });

    function getVH() {
        return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / 100;
    }

    magnifier.addEventListener("click", (e) => {
        document.querySelector('.spinner').style.display = 'inline-block';
        let val = input.value;
        let urlFlag = false;
        if (val === "") {
            alert("Please enter an URL or text.");
            return;
        } else if (val.startsWith("http")) {
            urlFlag = true;
        }
        axios({
                method: 'post',
                url: '/api/url',
                data: {
                    url: input.value,
                    urlFlag: urlFlag
                }
            })
            .then(function(response) {
                analysistext.style.display = 'block';
                analysistext.innerHTML = converter.makeHtml(response.data.analysis);
                analysistext.style.height = 'auto';
                analysistext.style.height = analysistext.scrollHeight + 'px';
                window.scrollTo(0, 30 * getVH(), {
                    behavior: 'smooth'
                });
                console.log(response);
                document.querySelector('.spinner').style.display = 'none';
            })
            .catch(function(error) {
                console.log(error);
                document.querySelector('.spinner').style.display = 'none';
                alert("Some error occured. Please try again.");
            })
        e.stopPropagation();
    });

    search.classList.toggle("active");

    // $(document).ready(function() {
    //     $('#title').focus();
    //     $('#text').autosize();
    // });

    // document.body.addEventListener("click", (e) => {
    //     if (!search.contains(e.target)) {
    //         search.classList.remove("active");
    //     }
    // });

    // micIcon.addEventListener("click", () => {
    //     recognition.start();

    //     recognition.onresult = (e) => {
    //         const result = event.results[0][0].transcript;
    //         input.value = result;
    //     };
    //     input.value = "";

    //     recognition.onerror = (event) => {
    //         alert("Speech recognition error: " + event.error);
    //     };
    // });

}