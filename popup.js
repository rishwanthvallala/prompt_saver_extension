document.addEventListener('DOMContentLoaded', function() {
  const addButton = document.getElementById('addButton');
  const headingList = document.getElementById('headingList');
  const headingInput = document.getElementById('heading'); // Get the heading input element
  const contentInput = document.getElementById('content'); // Get the content input element

  addButton.addEventListener('click', function() {
    const heading = headingInput.value;
    const content = contentInput.value;

    // Save the data to storage
    chrome.storage.sync.set({ [heading]: content }, function() {
      // Update the UI
      const entryItem = document.createElement('li');
      entryItem.className = 'entry';
      entryItem.innerHTML = `
        <span class="entry-heading">${heading}</span>
        <div class="buttons">
          <button class="copy-button">Copy</button>
          <button class="remove-button">Remove</button>
        </div>
      `;
      headingList.appendChild(entryItem);

      // Clear input fields after adding entry
      headingInput.value = ''; // Clear the heading input
      contentInput.value = ''; // Clear the content input
    });
  });

  // Pre-built entries
  const preBuiltEntries = [
    { heading: 'Pre-built Heading 1', content: 'Pre-built Content 1' },
    { heading: 'Pre-built Heading 2', content: 'Pre-built Content 2' },
    // Add more pre-built entries as needed
  ];

  preBuiltEntries.forEach(entry => {
    const { heading, content } = entry;
    chrome.storage.sync.set({ [heading]: content });
    const entryItem = document.createElement('li');
    entryItem.className = 'entry';
    entryItem.innerHTML = `
      <span class="entry-heading">${heading}</span>
      <div class="buttons">
        <button class="copy-button">Copy</button>
        <button class="remove-button">Remove</button>
      </div>
    `;
    headingList.appendChild(entryItem);
  });

  // Load saved entries on popup open
  chrome.storage.sync.get(null, function(result) {
    Object.keys(result).forEach(function(heading) {
      const entryItem = document.createElement('li');
      entryItem.className = 'entry';
      entryItem.innerHTML = `
        <span class="entry-heading">${heading}</span>
        <div class="buttons">
          <button class="copy-button">Copy</button>
          <button class="remove-button">Remove</button>
        </div>
      `;
      headingList.appendChild(entryItem);
    });
  });

  // Handle copy button click event
  headingList.addEventListener('click', function(event) {
    if (event.target.classList.contains('copy-button')) {
      const heading = event.target.parentNode.parentNode.querySelector('.entry-heading').textContent;
      chrome.storage.sync.get(heading, function(result) {
        const tempInput = document.createElement('textarea');
        document.body.appendChild(tempInput);
        tempInput.value = result[heading];
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      });
    }
  });

  // Handle remove button click event
  headingList.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-button')) {
      const heading = event.target.parentNode.parentNode.querySelector('.entry-heading').textContent;
      chrome.storage.sync.remove(heading, function() {
        event.target.parentNode.parentNode.remove();
      });
    }
  });
});