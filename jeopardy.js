// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
// let tableSetUp = false;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

// Retrieves categories, shuffles and selects 6
let count = 100; //max return of categories from API
async function getCategoryIds(count) {
    const res = await axios.get('http://jservice.io/api/categories', 
    {
    params:{count}
    });
    const catIds = res.data.map(cat => cat.id);
    console.log("shuffled ids", shuffleArray(catIds, 6));
    let idArray = shuffleArray(catIds, 6)
    await getQuestions(idArray);
};

//randomly shuffles an array of integers
//returns an array of the first num integers from shuffled array
function shuffleArray(array, num) { 
    for (let i = array.length - 1; i > 0; i--) {  
        let j = Math.floor(Math.random() * (i + 1));                      
        let temp = array[i]; 
        array[i] = array[j]; 
        array[j] = temp; 
    } 
    array.splice(num);
    return(array);
 };



dataArray = [];
headerArray = [];

// Retrieves details for specific category based on id incl. questions and answers
async function getQuestions(idArray) {
    for(let id of idArray){
       const res = await axios.get('http://jservice.io/api/category', {params:{id}});
       dataArray.push(res.data);
    }
    for(let header of dataArray){
        headerArray.push(header.title);
        }
    }


//set up the table

async function fillTable() {
    let table = $('<table>').appendTo('body');


    $('<thead>').addClass('header').appendTo(table);
    $('<tr>').appendTo('thead');
    for(let i=0; i<6; i++){
        $('<th>').appendTo('tr').text(headerArray[i]);
    };
    
    let tbody = $('<tbody>').appendTo(table);


    for(let i=0; i<5; i++){
        console.log("i is: ", i);
        let row = $('<tr>').appendTo(tbody)

    for(let j=0; j<6; j++){
        let cell = $('<td>');
        cell.text('?').attr('id', `${j}-${i}`);
        row.append(cell);
        }
    };
        
    // tableSetUp = true;

    hideLoadingView();
};



$(window).on('load', function () {
    $('#loading').hide();
  }) 

// Handle clicking on a clue: show the question or answer.
 //contols the value displayed in the question/answer squares when a click occurs

    $('body').on('click', 'tbody tr td', function() {
        let idVar = $(this).attr('id');
        let catRef = parseInt(idVar[0]);
        let clueRef = parseInt(idVar[2]);
        
        if($(this).text() === '?') {
            $(this).text(dataArray[catRef].clues[clueRef].question)
        }
        else if($(this).text() === dataArray[catRef].clues[clueRef].question) {
            $(this).text(dataArray[catRef].clues[clueRef].answer);
            }            
    }  
);



/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

 //unsuccessful attempt to show spinner
// function showLoadingView() {
//     $('td').empty();
//     $('table').append('<div class="lds-hourglass"></div>');
//     $('button').text('Loading data');
// }
// function showSpinner() {
//     $('body').append('<div class="lds-ring"></div>');
// }


/** Remove the loading spinner and update the button used to fetch data. */
// function hideLoadingView() {
//     $(".lds-ring").remove();
//     $('button').text('Restart');
// }


//removes existing table
//recereates and populates table
async function setupAndStart() {
    $('table').remove();
    dataArray.length = 0
    headerArray.length = 0;
    await getCategoryIds(count);
    await fillTable();
}

//upon click, removes table and then recreates it with fresh data
$('button').on('click', async function(){
    setupAndStart();
});


//called upon loading of HTML page
setupAndStart();


