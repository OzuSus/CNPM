// Tro ly ao
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;
recognition.lang = 'vi-VI';
recognition.continuous = false;

const microphone = document.querySelector('.microphone-button');

const speak = (text) => {
    if (synth.speaking) {
        console.error('Busy. Speaking...');
        return;
    }

    const utter = new SpeechSynthesisUtterance(text);

    utter.onend = () => {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utter.onerror = (err) => {
        console.error('SpeechSynthesisUtterance.onerror', err);
    }

    synth.speak(utter);
};

const handleVoice = (text) => {
    console.log('text', text);

    // "thời tiết tại Đà Nẵng" => ["thời tiết tại", "Đà Nẵng"]
    const handledText = text.toLowerCase();
    if (handledText.includes('thời tiết tại')) {
        const location = handledText.split('tại')[1].trim();

        console.log('location', location);
        searchInput.value = location;
        const changeEvent = new Event('change');
        searchInput.dispatchEvent(changeEvent);
        return;
    }

    const container = document.querySelector('.container');
    if (handledText.includes('thay đổi màu nền')) {
        const color = handledText.split('màu nền')[1].trim();
        container.style.background = color;
        return;
    }

    if (handledText.includes('màu nền mặc định')) {
        container.style.background = '';
        return;
    }

    if (handledText.includes('mấy giờ')) {
        const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`;
        speak(textToSpeech);
        return;
    }

    speak('Try again');
}

microphone.addEventListener('click', (e) => {
    e.preventDefault();

    recognition.start();
    microphone.classList.add('recording');
});

recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove('recording');
}

recognition.onerror = (err) => {
    console.error(err);
    microphone.classList.remove('recording');
}

recognition.onresult = (e) => {
    console.log('onresult', e);
    const text = e.results[0][0].transcript;
    handleVoice(text);
}