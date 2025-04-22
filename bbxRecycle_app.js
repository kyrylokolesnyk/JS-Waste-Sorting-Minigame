var binsInfo = [
					{name:"Glass", color:"#16A100"},
					{name:"Paper", color:"#0093AD"},
					{name:"Metal", color:"#E5C600"},
					{name:"Plastic", color:"#E27900"},
					{name:"Organic", color:"#7A4523"}
				];
var itemsInfo = [
					{id:"glassBottle-item", src:"assets/glassBottle.png", type:"glass", size: "medium"},
					{id:"wineGlass-item", src:"assets/wineGlass.png", type:"glass", size: "medium"},
					
					{id:"newspaper-item", src:"assets/newspaper.png", type:"paper", size: "medium"},
					{id:"paperBox-item", src:"assets/paperBox.png", type:"paper", size: "big"},
					
					{id:"sodaCan-item", src:"assets/sodaCan.png", type:"metal", size: "small"},
					{id:"metalPipe-item", src:"assets/metalPipe.png", type:"metal", size: "small"},
					
					{id:"plasticBottle-item", src:"assets/plasticBottle.png", type:"plastic", size: "medium"},
					{id:"plasticBag-item", src:"assets/plasticBag.png", type:"plastic", size: "big"},
					
					{id:"appleCore-item", src:"assets/appleCore.png", type:"organic", size: "small"},
					{id:"bananaPeel-item", src:"assets/bananaPeel.png", type:"organic", size: "small"}
];

const popupOverlayElem = document.getElementById("popupOverlay");
const popupTextElem = document.getElementById("popupText");
const againbuttonElem = document.getElementById("againButton");
const binsRowElem = document.getElementById("binsRow");
const itemContainerElem = document.getElementById("itemContainer");
var points = 0;

renderBins();
renderItems();
randomizeItemPositions();
gameLogic();

function gameLogic() {
	var itemElems = document.querySelectorAll(".draggable-item");
	var binElems = document.querySelectorAll(".hover-wrapper");

	itemElems.forEach((item) => {
		item.addEventListener("dragstart", (e) => {
			e.dataTransfer.setData("itemId", item.getAttribute("id"));
			e.dataTransfer.setData("itemType", item.getAttribute("data-type"));
			e.dataTransfer.setData("itemStartX", item.getBoundingClientRect().left);
			e.dataTransfer.setData("itemStartY", item.getBoundingClientRect().top);
		});
		
		item.addEventListener("dragend", (e) => {
			var x = e.clientX - itemContainerElem.offsetLeft - item.offsetWidth / 2;
			var y = e.clientY - itemContainerElem.offsetTop - item.offsetHeight / 2;

			if (x >= 0 && y >= 0) {
				/*
				item.style.left = `${x}px`;
				item.style.top = `${y}px`;
				*/
				item.style.transform = `translate(${x}px, ${y}px)`;
			}
		});
	});

	binElems.forEach((bin) => {
		let arrow = bin.previousElementSibling;
		bin.addEventListener("dragover", (e) => {
			e.preventDefault();
			bin.classList.add("drag-over");
		});
		
		bin.addEventListener("dragenter", () => {
			arrow.classList.remove("none");
		});
		
		bin.addEventListener("dragleave", () => {
			bin.classList.remove("drag-over");
			arrow.classList.add("none");
		});

		bin.addEventListener("drop", (e) => {
			e.preventDefault();
			bin.classList.remove("drag-over");
			arrow.classList.add("none");
			
			var itemId = e.dataTransfer.getData("itemId");
			var itemType = e.dataTransfer.getData("itemType");
			var binType = bin.parentNode.id.split("-")[0];
			
			var itemStartX = e.dataTransfer.getData("itemStartX") - itemContainerElem.offsetLeft;
			var itemStartY = e.dataTransfer.getData("itemStartY") - itemContainerElem.offsetTop;

			var droppedItem = document.getElementById(itemId);
			
			if (itemType === binType) {
				//alert(`Correct! ${itemType} goes in the ${binType} bin. +1 point`);
				droppedItem.remove();
				popupTextElem.textContent = "Correct!";
				popupOverlayElem.style.background = "radial-gradient(circle, rgba(255,255,255,0) 20%, rgba(0,255,0,0.5) 100%)";
				popupOverlayElem.classList.remove("none");

				setTimeout(() => {
					popupOverlayElem.style.opacity = "1";
					popupTextElem.style.color = "green";
					points++;
					setTimeout(() => {
						popupOverlayElem.style.opacity = "0";
						popupTextElem.style.color = "transparent";
						setTimeout(() => {
							popupOverlayElem.classList.add("none");
							if (points == itemsInfo.length) {
								console.log("good");
								popupTextElem.textContent = "Great job!";
								popupOverlayElem.style.background = "radial-gradient(circle, rgba(255,255,255,0) 20%, rgba(0,255,0,0.5) 100%)";
								popupOverlayElem.classList.remove("none");
								againbuttonElem.classList.remove("none");

								setTimeout(() => {
									popupOverlayElem.style.opacity = "1";
									popupTextElem.style.color = "green";
									againbuttonElem.style.opacity = "1";
								}, 100);
							}
						}, 500);
					}, 700);
				}, 100);
			} else {
				//alert(`Wrong! ${itemType} doesn't belong in the ${binType} bin.`);
				popupTextElem.textContent = "Wrong bin!";
				popupOverlayElem.style.background = "radial-gradient(circle, rgba(255,255,255,0) 20%, rgba(255,0,0,0.5) 100%)";
				popupOverlayElem.classList.remove("none");

				setTimeout(() => {
					popupOverlayElem.style.opacity = "1";
					popupTextElem.style.color = "red";
					droppedItem.style.transform = `translate(${itemStartX}px, ${itemStartY}px)`;
					setTimeout(() => {
						popupOverlayElem.style.opacity = "0";
						popupTextElem.style.color = "transparent";
						setTimeout(() => {
							popupOverlayElem.classList.add("none");
						}, 500);
					}, 700);
				}, 100);
			}
		});
	});
}

function renderBins() {
	binsInfo.forEach((bin) => {
		let binContainerElem = document.createElement("div");
		binContainerElem.setAttribute("id", `${bin.name.toLowerCase()}-bin`);
		binContainerElem.setAttribute("class", "bin-container");
		
		let arrowElem = document.createElement("div");
		arrowElem.setAttribute("class", "arrow none");
		
		let hoverWrapperElem = document.createElement("div");
		hoverWrapperElem.setAttribute("class", "hover-wrapper");
		
		let rectangleElem = document.createElement("div");
		rectangleElem.setAttribute("class", "rectangle");
		rectangleElem.style.background = bin.color;
		
		let trapezoidBorderElem = document.createElement("div");
		trapezoidBorderElem.setAttribute("class", "trapezoid-border");
		
		let trapezoidElem = document.createElement("div");
		trapezoidElem.setAttribute("class", "trapezoid");
		trapezoidElem.style.background = bin.color;
		
		let innerDivElem = document.createElement("div");
		innerDivElem.setAttribute("class", "inner-div");
		innerDivElem.textContent = `${bin.name.toUpperCase()}`;
		
		let recycleImgElem = document.createElement("img");
		recycleImgElem.setAttribute("class", "recycle");
		recycleImgElem.setAttribute("src", "assets/recycle_white.png");
		
		trapezoidElem.appendChild(innerDivElem);
		trapezoidElem.appendChild(recycleImgElem);
		
		trapezoidBorderElem.appendChild(trapezoidElem);
		
		hoverWrapperElem.appendChild(rectangleElem);
		hoverWrapperElem.appendChild(trapezoidBorderElem);
		
		binContainerElem.appendChild(arrowElem);
		binContainerElem.appendChild(hoverWrapperElem);
		
		binsRowElem.appendChild(binContainerElem);
	});
}

function renderItems() {
	let smallSize = 20;
	let mediumSize = 35;
	let bigSize = 65;
	
	itemsInfo.forEach((item) => {
		let itemElem = document.createElement("img");
		itemElem.setAttribute("src", item.src);
		itemElem.setAttribute("id", item.id);
		itemElem.setAttribute("class", "draggable-item");
		itemElem.setAttribute("draggable", true);
		itemElem.setAttribute("data-type", item.type);
		
		itemElem.setAttribute("width", "fit-content");
		switch (item.size.toLowerCase()) {
			case "small":
				itemElem.setAttribute("height", `${smallSize}%`);
				break;
			case "medium":
				itemElem.setAttribute("height", `${mediumSize}%`);
				break;
			case "big":
				itemElem.setAttribute("height", `${bigSize}%`);
				break;
			default:
				itemElem.setAttribute("height", `${smallSize}%`);
		}		
		
		itemContainerElem.appendChild(itemElem);
	});
}

function randomizeItemPositions() {
	let items = document.querySelectorAll(".draggable-item");
	
	var containerRect = itemContainerElem.getBoundingClientRect();
	
	items.forEach((item) => {
		var itemWidth = item.offsetWidth;
		var itemHeight = item.offsetHeight;

		var randomX = Math.random() * (containerRect.width - itemWidth);
		var randomY = Math.random() * (containerRect.height - itemHeight);
		
		/*
		item.style.left = `${randomX}px`;
		item.style.top = `${randomY}px`;
		*/
	
		item.style.transform = `translate(${randomX}px, ${randomY}px)`;
	});
}

function playAgain() {
	popupOverlayElem.classList.add("none");
	againbuttonElem.classList.add("none");
	popupOverlayElem.style.opacity = "0";
	popupTextElem.style.color = "transparent";
	againbuttonElem.style.opacity = "0";
	
	points = 0;
	renderItems();
	randomizeItemPositions();
	gameLogic();
}
