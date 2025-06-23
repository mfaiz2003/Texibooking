// date api fetch
  fetchDate('https://worldtimeapi.org/api/timezone/Etc/UTC')
  .then(response => response.json())
  .then(data => {
    const fullDateTime = data.datetime; 
    const dateOnly = fullDateTime.split('T')[0]; 

    //
    document.getElementById('dateInput').value = dateOnly;
  })
  .catch(error => {
    console.error('Date fetch karne me error:', error);
  });

  async function fetchTime() {
    const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata');
    const data = await response.json();
  
    
    const datetime = data.datetime;
  
    const time = datetime.substring(11, 16);

    document.getElementById('time').value = time;
  }

  