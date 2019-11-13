const galleryDiv = document.querySelector("#gallery")
const activitiesDiv = document.querySelector(".activityCards")
const params = new URLSearchParams(window.location.search)
const temp = params.get("temp")

fetch(`http://localhost:3000/activities/`)
    .then(response => response.json())
    .then(activities => activities.map(activity => {
        if (activity.temperature >= +temp-20 && activity.temperature <= +temp+20) {
            showCards(activity)
        }
    }))

function fetchActivityPlans(){
    return fetch("http://localhost:3000/activity_plans")
        .then(response => response.json())
        .then(activity_plans => activity_plans.map(activity_plan => {
            return activity_plan.activity_id
        }))
}
    
function showCards(activity){  
    fetchActivityPlans()
        .then(activityIds => {
            if (!activityIds.includes(activity.id)){
                createCard(activity)
            }
        })
}  

function createCard(activity){
    const h1 = document.createElement("h1")
    const img = document.createElement("img")
    const addButton = document.createElement('button')
    const editButton = document.createElement('button')
    const deleteButton = document.createElement('button')
    const activityDiv = document.createElement("div")
    h1.innerText = activity.name
    img.setAttribute("src", activity.photo)

    addButton.innerText = "ADD THIS TO YOUR PLAN"

    addButton.addEventListener("click", function(event){
        fetch("http://localhost:3000/activity_plans", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"   
            },
            body: JSON.stringify({
                activity_id: activity.id
            })
        })
        .then(response => window.location = "http://localhost:3001/")
    })

    editButton.innerText = "EDIT"
    editButton.addEventListener("click", function(event){
        window.location.href = `activityEdit.html?id=${activity.id}`
    })

    deleteButton.innerText = "DELETE"
    deleteButton.addEventListener("click", function(event){
        event.target.parentNode.remove()
        fetch(`http://localhost:3000/activities/${activity.id}`, {
            method: "DELETE"
        })
    })
    activityDiv.setAttribute("class", "activity")
    activityDiv.append(img, h1, addButton, editButton, deleteButton)
    activitiesDiv.appendChild(activityDiv)
}
