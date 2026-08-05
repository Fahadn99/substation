let websites = {};
let dataLoaded = false;

// تحميل البيانات
function loadWebsitesData() {
  if (dataLoaded) return Promise.resolve();

  const files = [
    './data/QBS.json',
    './data/QRS.json',
    './data/QUS.json',
    './data/QWS.json',
    './data/QMS.json',
    './data/websites.json',
    './data/alasyah.json'
  ];

  const fetchPromises = files.map(file =>
    fetch(file)
      .then(res => {
        if (!res.ok) {
          throw new Error(`خطأ في تحميل الملف: ${file}`);
        }
        return res.json();
      })
  );

  return Promise.all(fetchPromises)
    .then(dataArray => {
      dataArray.forEach(data => {
        Object.assign(websites, data);
      });
      dataLoaded = true;
      console.log("✅ تم تحميل البيانات");
    })
    .catch(error => {
      console.error("❌ خطأ:", error);
    });
}
``

// وظيفة للحصول على رابط باستخدام المفتاح
function getWebsiteByKey(key) {
  if (!dataLoaded) {
    console.error('Data not loaded yet. Call loadWebsitesData first.');
    return null;
  }

  return websites[key] || 'Key not found';
}

// تحميل البيانات وتجربة الوصول لها
loadWebsitesData().then(() => {
  console.log(getWebsiteByKey("79906")); // يعرض الرابط إذا كان المفتاح موجودًا
});
// عدّل دوال البحث والاقتراحات لتنتظر تحميل البيانات أولاً:
function showSuggestions(searchTerm) {
  loadWebsitesData().then(() => {
    // ...نفس الكود السابق لعرض الاقتراحات...
  });
}

function performSearch(searchTerm) {
  loadWebsitesData().then(() => {
    // ...نفس كود البحث السابق...
  });
}
// script.js
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("resultsContainer");
const suggestionsContainer = document.getElementById("suggestions");

// فتح نافذة الملاحظات
if (feedbackBtn) {
  feedbackBtn.onclick = function() {
    feedbackModal.style.display = "flex";
  };
}

// إغلاق النافذة
if (closeModal) {
  closeModal.onclick = function() {
    feedbackModal.style.display = "none";
  };
}

// إغلاق عند الضغط خارج النموذج
if (feedbackModal) {
  window.onclick = function(event) {
    if (event.target === feedbackModal) {
      feedbackModal.style.display = "none";
    }
  };
}

// البحث التلقائي مع تأخير
let searchTimer;
if (searchInput) {
  searchInput.addEventListener("input", function() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      showSuggestions(this.value.trim());
    }, 300);
  });

  searchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      performSearch(this.value.trim());
      suggestionsContainer.style.display = "none";
    }
  });
}

if (suggestionsContainer) {
  document.addEventListener("click", function(e) {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.style.display = "none";
    }
  });
}

function showSuggestions(searchTerm) {
  suggestionsContainer.innerHTML = "";
  suggestionsContainer.style.display = "none";

  if (!searchTerm) {
    return;
  }

  const matchingKeys = Object.keys(websites).filter(key =>
        key.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingKeys.length > 0) {
        matchingKeys.forEach(key => {
            const suggestionItem = document.createElement("div");
            suggestionItem.textContent = key;
            suggestionItem.className = "suggestion-item";
            suggestionItem.addEventListener("click", () => {
                searchInput.value = key;
                performSearch(key);
                suggestionsContainer.style.display = "none";
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
        suggestionsContainer.style.display = "block";
    }
}

function performSearch(searchTerm) {
  resultsContainer.innerHTML = "<p>جارٍ البحث...</p>";

  if (!searchTerm) {
    resultsContainer.innerHTML = "<p>الرجاء إدخال كلمة للبحث</p>";
    resultsContainer.className = "error-message";
    return;
  }

  const foundKey = Object.keys(websites).find(key =>
    key.toLowerCase() === searchTerm.toLowerCase()
  );

  if (foundKey) {

    resultsContainer.innerHTML = "";

    const value = websites[foundKey];

    let finalUrl = "";

    // الطريقة القديمة
    if (typeof value === "string" && value.startsWith("http")) {
      finalUrl = value;
    }

    // الطريقة الجديدة (إحداثيات)
    else if (typeof value === "string") {
      finalUrl = `https://www.google.com/maps?q=${value}`;
    }

    const linkElement = document.createElement("a");
    linkElement.href = finalUrl;
    linkElement.textContent = "انقر هنا للانتقال إلى الموقع";
    linkElement.target = "_blank";
    linkElement.className = "result-link";

    resultsContainer.appendChild(linkElement);

  } else {
    resultsContainer.innerHTML = "<p>لم يتم العثور على الموقع المطلوب.</p>";
    resultsContainer.className = "error-message";
  }
}
