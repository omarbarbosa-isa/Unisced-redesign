
/* ==================================
   UNISCED - GESTÃO DE CURSOS
================================== */

// Catálogo baseado na oferta institucional publicada
const courses = [
    { id: 1, name: "Administração Pública", faculty: "Ciências Sociais e Humanas", level: "Licenciatura" },
    { id: 2, name: "Comunicação Aplicada ao Jornalismo e Marketing", faculty: "Ciências Sociais e Humanas", level: "Licenciatura" },
    { id: 3, name: "Ciência Política e Relações Internacionais", faculty: "Ciências Sociais e Humanas", level: "Licenciatura" },
    { id: 4, name: "Contabilidade e Auditoria", faculty: "Economia e Gestão", level: "Licenciatura" },
    { id: 5, name: "Direito", faculty: "Direito", level: "Licenciatura" },
    { id: 6, name: "Ensino de Biologia", faculty: "Ciências de Educação", level: "Licenciatura" },
    { id: 7, name: "Ensino de Geografia", faculty: "Ciências de Educação", level: "Licenciatura" },
    { id: 8, name: "Ensino de História", faculty: "Ciências de Educação", level: "Licenciatura" },
    { id: 9, name: "Ensino de Matemática", faculty: "Ciências de Educação", level: "Licenciatura" },
    { id: 10, name: "Ensino de Português", faculty: "Ciências de Educação", level: "Licenciatura" },
    { id: 11, name: "Gestão Ambiental", faculty: "Economia e Gestão", level: "Licenciatura" },
    { id: 12, name: "Gestão de Empresas", faculty: "Economia e Gestão", level: "Licenciatura" },
    { id: 13, name: "Gestão de Recursos Humanos", faculty: "Economia e Gestão", level: "Licenciatura" },
    { id: 14, name: "Gestão de Sistemas de Informação", faculty: "Economia e Gestão", level: "Licenciatura" },
    { id: 15, name: "Gestão de Turismo", faculty: "Economia e Gestão", level: "Licenciatura" },
    { id: 16, name: "Agronegócios", faculty: "Engenharias e Agricultura", level: "Licenciatura" },
    { id: 17, name: "Desenvolvimento Agrário", faculty: "Engenharias e Agricultura", level: "Licenciatura" },
    { id: 18, name: "Engenharia Informática", faculty: "Engenharias e Agricultura", level: "Licenciatura" },
    { id: 19, name: "Nutrição", faculty: "Ciências de Saúde", level: "Licenciatura" }
];

// Elementos HTML
const searchInput = document.getElementById("search-course");
const facultyFilter = document.getElementById("filter-faculty");
const sortSelect = document.getElementById("sort-courses");

const coursesList = document.getElementById("courses-list");
const courseCount = document.getElementById("course-count");
const emptyMessage = document.getElementById("empty-message");

const interestList = document.getElementById("interest-list");
const interestEmpty = document.getElementById("interest-empty");

// Recuperar lista guardada
let interests = [];

try {
    const storedInterests = JSON.parse(
        localStorage.getItem("unisced-interests") || "[]"
    );
    interests = Array.isArray(storedInterests)
        ? storedInterests.filter(id => Number.isInteger(id))
        : [];
} catch (error) {
    interests = [];
}

// Guardar lista de interesse
function saveInterests() {
    localStorage.setItem(
        "unisced-interests",
        JSON.stringify(interests)
    );
}

// Adicionar curso à lista
function addInterest(id) {

    if (interests.includes(id)) {
        return;
    }

    interests.push(id);

    saveInterests();
    renderCourses();
    renderInterests();
}

// Remover curso da lista
function removeInterest(id) {

    interests = interests.filter(courseId => courseId !== id);

    saveInterests();
    renderCourses();
    renderInterests();
}

// Criar cartão de curso
function createCourseCard(course) {

    const card = document.createElement("article");
    card.className = "course-card";

    const title = document.createElement("h3");
    title.textContent = course.name;

    const faculty = document.createElement("p");
    faculty.className = "course-faculty";
    faculty.textContent = course.faculty;

    const level = document.createElement("span");
    level.className = "course-level";
    level.textContent = course.level;

    const button = document.createElement("button");
    button.className = "btn btn-gold course-button";

    const isSaved = interests.includes(course.id);

    button.textContent = isSaved
        ? "Adicionado à lista"
        : "Adicionar à lista";

    button.disabled = isSaved;

    button.addEventListener("click", () => {
        addInterest(course.id);
    });

    card.append(title, faculty, level, button);

    return card;
}

// Pesquisar, filtrar e ordenar
function renderCourses() {

    const search = searchInput.value
        .trim()
        .toLocaleLowerCase("pt");

    const faculty = facultyFilter.value;
    const order = sortSelect.value;

    let filteredCourses = courses.filter(course => {

        const matchesName = course.name
            .toLocaleLowerCase("pt")
            .includes(search);

        const matchesFaculty = faculty === ""
            || course.faculty === faculty;

        return matchesName && matchesFaculty;
    });

    filteredCourses.sort((a, b) => {

        const comparison = a.name.localeCompare(
            b.name,
            "pt",
            { sensitivity: "base" }
        );

        return order === "az" ? comparison : -comparison;
    });

    coursesList.replaceChildren();

    filteredCourses.forEach(course => {
        coursesList.appendChild(createCourseCard(course));
    });

    courseCount.textContent =
        `${filteredCourses.length} curso(s) encontrado(s)`;

    emptyMessage.hidden = filteredCourses.length !== 0;
}

// Mostrar lista de interesse
function renderInterests() {

    interestList.replaceChildren();

    const savedCourses = courses.filter(course =>
        interests.includes(course.id)
    );

    savedCourses.forEach(course => {

        const item = document.createElement("div");
        item.className = "interest-item";

        const title = document.createElement("span");
        title.textContent = course.name;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.textContent = "Remover";

        removeButton.addEventListener("click", () => {
            removeInterest(course.id);
        });

        item.append(title, removeButton);
        interestList.appendChild(item);
    });

    interestEmpty.hidden = savedCourses.length !== 0;
}

// Eventos dos filtros
searchInput.addEventListener("input", renderCourses);
facultyFilter.addEventListener("change", renderCourses);
sortSelect.addEventListener("change", renderCourses);

// Inicializar catálogo
renderCourses();
renderInterests();
