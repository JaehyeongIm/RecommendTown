document.addEventListener("DOMContentLoaded", function () {
    var accessToken = 'none';
    var errCnt = 0;
    getAccessToken();

    function getAccessToken() {
        jQuery.ajax({
            type: 'GET',
            url: 'https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json',
            data: {
                consumer_key: 'f9067eed4cf041169895',
                consumer_secret: 'b0184a48f3244f74ae9c',
            },
            success: function (data) {
                errCnt = 0;
                accessToken = data.result.accessToken
                alert("엑세스 키:"+accessToken);
            },
            error: function (data) {
            }
        });
    }

    document.getElementById('count').addEventListener('click', function () {
        const selectedCategory = document.getElementById('categorySelect').value;
        if (!selectedCategory) {
            alert('카테고리를 선택하세요.');
            return;
        }


        fecthUrl1()

        function fecthUrl1() {
            const queryParams = new URLSearchParams({
                accessToken: accessToken,
                sido_cd: '11',
                theme_cd: selectedCategory
            });

            const apiUrl = `https://sgisapi.kostat.go.kr/OpenAPI3/startupbiz/sggtobrank.json?${queryParams}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (parseInt(data.errCd) === -401) {
                        errCnt++;
                        if (errCnt < 200) {
                            getAccessToken();
                            fecthUrl1()
                        }
                    }
                    displayDataInTable1(data.result.sgg_info);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

    });

    // document.getElementById('location').addEventListener('click', function () {
    //
    //
    //     const queryParams = new URLSearchParams({
    //         accessToken: '5e1b15d5-5920-4488-a6df-6a28e9131403',
    //         sido_cd: '11'
    //     });
    //     console.log(queryParams)
    //     const apiUrl = `https://sgisapi.kostat.go.kr/OpenAPI3/startupbiz/sidotobrank.json?${queryParams}`;
    //
    //     fetch(apiUrl)
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data)
    //             displayDataInTable2(data.result.tob_rank);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    // });

    function displayDataInTable1(sgg_info) {
        // 테이블 요소를 생성합니다.
        const table = document.createElement('table');
        table.style.width = '40%';
        table.style.textAlign = 'center';

        // 테이블 헤더를 생성합니다.
        const thead = table.createTHead();
        const headerRow = thead.insertRow();

        // '시군구명'과 '사업체수' 헤더를 추가합니다.
        ['시군구명', '시설 수'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });

        // 테이블 바디를 생성합니다.
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        // 데이터 각 행에 대해 반복합니다.
        sgg_info.forEach(item => {
            const row = tbody.insertRow();

            // 시군구명(sgg_nm) 셀을 추가합니다.
            const sggNmCell = row.insertCell();
            sggNmCell.textContent = item.sgg_nm;

            // 사업체수(corp_cnt) 셀을 추가합니다.
            const corpCntCell = row.insertCell();
            corpCntCell.textContent = item.corp_cnt;
        });

        // 테이블을 #content div에 추가합니다.
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = ''; // 기존 내용을 비웁니다.
        contentDiv.appendChild(table); // 새로운 테이블을 추가합니다.


    }

    // function displayDataInTable2(tob_rank) {
    //     // 테이블 요소를 생성합니다.
    //     const table = document.createElement('table');
    //     table.style.width = '100%';
    //     table.style.textAlign = 'center';
    //
    //     // 테이블 헤더를 생성합니다.
    //     const thead = table.createTHead();
    //     const headerRow = thead.insertRow();
    //     console.log(tob_rank)
    //     // 데이터의 첫 번째 항목의 모든 키를 사용하여 헤더를 생성합니다.
    //     if (tob_rank.length > 0) {
    //         Object.keys(tob_rank[0]).forEach(key => {
    //             const th = document.createElement('th');
    //             th.textContent = key; // 키 이름을 헤더로 사용합니다.
    //             headerRow.appendChild(th);
    //         });
    //     }
    //
    //     // 테이블 바디를 생성합니다.
    //     const tbody = table.createTBody();
    //
    //     // 데이터 각 행에 대해 반복합니다.
    //     tob_rank.forEach(item => {
    //         const row = tbody.insertRow();
    //         // 각 키의 값을 순회하며 셀을 추가합니다.
    //         Object.values(item).forEach(value => {
    //             const cell = row.insertCell();
    //             cell.textContent = value; // 각 값을 셀에 채웁니다.
    //         });
    //     });
    //
    //     // 테이블을 'content2'라는 ID를 가진 div에 추가합니다.
    //     const contentDiv = document.getElementById('content2');
    //     if (!contentDiv) {
    //         console.error('Element with ID "content2" not found.');
    //         return;
    //     }
    //     contentDiv.innerHTML = ''; // 기존 내용을 비웁니다.
    //     contentDiv.appendChild(table); // 새로운 테이블을 추가합니다.
    // }

});

