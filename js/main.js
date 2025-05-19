let currentData = {};

fetch("data/data.json")
  .then(res => res.json())
  .then(json => {
    currentData = json;
    showSection('education'); // 기본 표시
  });

function showSection(section) {
  const buttons = document.querySelectorAll('nav button');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = "";

  currentData[section].forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    let html = "";
    if (section === "education") {
      html += `<h3>${item.institution}</h3>`;
      html += `<p>${item.degree}</p>`;
      html += `<p>${item.start_date[0]}/${item.start_date[1]} - ${item.end_date[0]}/${item.end_date[1]}</p>`;
      item.details.forEach(detail => html += `<p>${detail}</p>`);
    } else if (section === "experience") {
      html += `<h3>${item.organization} - ${item.position}</h3>`;
      html += `<p>${item.location}</p>`;
      html += `<p>${item.start_date[0]}/${item.start_date[1]} - ${item.end_date[0]}/${item.end_date[1]}</p>`;
      html += `<p>${item.description}</p>`;
    } else if (section === "papers") {
      html += `<h3>${item.title}</h3>`;
      html += `<p><strong>First Authors:</strong> ${item.first_authors.join(", ")}</p>`;
      html += `<p><strong>Co-authors:</strong> ${item.co_authors.join(", ")}</p>`;
      html += `<p><strong>Corresponding:</strong> ${item.corresponding_authors.join(", ")}</p>`;
      html += `<p>${item.venue} (${item.year}) - ${item.tag}</p>`;
    } else if (section === "projects") {
      html += `<h3>${item.name}</h3>`;
      html += `<p>${item.organization} - ${item.date}</p>`;
      html += `<p>${item.description}</p>`;
    }

    card.innerHTML = html;
    contentDiv.appendChild(card);
  });
}