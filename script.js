const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle colour to gray
setIndicator("#ccc");



// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}


function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
   return Math.floor(Math.random() * (max-min)) + min;  
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol(){
     const randNum = getRndInteger(0, symbols.length -1);
     return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}


async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    // to make copy span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
         copyMsg.classList.remove("active");
    },2000);
    }


    function shufflePassword(array){
        // fisher yates method
         for(let i=array.length - 1; i>0; i--){
            const j = Math.floor(Math.random() * (i+1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
         }
            let str = "";
            array.forEach((el) => (str += el));
            return str;
    }

    function handleCheckBoxChange(){
        checkCount = 0;
        allCheckBox.forEach( (checkbox) => {
            if(checkbox.checked)
                checkCount++;
        });

        // special condition
        if(passwordLength < checkCount){
            passwordLength = checkCount;
            handleSlider();
        }
    }


    allCheckBox.forEach( (checkBox) => {
        checkBox.addEventListener('change', handleCheckBoxChange);
    })

    inputSlider.addEventListener('input', (e) => {
        passwordLength = e.target.value;
        handleSlider();
    })

    copyBtn.addEventListener('click', () => {
        if(passwordDisplay.value){
            copyContent();
        }
    } )

    generateBtn.addEventListener('click', () => {
        // none of the checkBox are selected
        if(checkCount <= 0){
            return;
        }

        if(passwordLength < checkCount){
            passwordLength = checkCount;
            handleSlider();
        }

        // lets start the journey to find the new password


        // remove old password
        password = "";

        // let's put the things mentioned by checkboxes
        // if(uppercaseCheck.checked){
        //     password += generateUpperCase();
        // }

        // if(lowercaseCheck.checked){
        //     password += generateLowerCase();
        // }

        // if(numbersCheck.checked){
        //     password += generateRandomNumber();
        // }

        // if(symbolsCheck.checked){
        //     password += generateSymbol();
        // }
        

        let functArr = [];

        if(uppercaseCheck.checked){
            functArr.push(generateUpperCase);
        }

        if(lowercaseCheck.checked){
            functArr.push(generateLowerCase);
        }

        if(numbersCheck.checked){
            functArr.push(generateRandomNumber);
        }

        if(symbolsCheck.checked){
            functArr.push(generateSymbol);
        }

        // compulsory addition
        for(let i=0; i<functArr.length; i++){
            password += functArr[i]();
        }
        console.log("COmpulsory adddition done");



        // remaining addition
        for(let i=0; i<passwordLength-functArr.length; i++){
            let randIndex = getRndInteger(0, functArr.length);
            password += functArr[randIndex]();
        }
        console.log("Remaining adddition done");

        // shuffle the password
        password = shufflePassword(Array.from(password));
        console.log("Shuffling done");

        // showing in UI
        passwordDisplay.value = password;
        console.log("UI adddition done");

        // calculate strength of password
        calcStrength();

    });
