// date api fetch
  fetchDate('https://worldtimeapi.org/api/timezone/Etc/UTC')
  .then(response => response.json())
  .then(data => {
    const fullDateTime = data.datetime; // Format: 2025-05-06T14:34:12.123456+00:00
    const dateOnly = fullDateTime.split('T')[0]; // sirf date part nikalna (e.g. 2025-05-06)

    // Input field me set karna
    document.getElementById('dateInput').value = dateOnly;
  })
  .catch(error => {
    console.error('Date fetch karne me error:', error);
  });

  async function fetchTime() {
    // Fetch current time from the WorldTime API
    const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata');
    const data = await response.json();
  
    // Get the time from the API response
    const datetime = data.datetime;
  
    // Extract the time portion (HH:MM:SS)
    const time = datetime.substring(11, 16); // HH:MM from 'YYYY-MM-DDTHH:MM:SS'
  
    // Set the value of the time input field
    document.getElementById('time').value = time;
  }

  localStorage.setItem("userId", response.user._id);

 
