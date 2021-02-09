const WIDTH_SMALL_BOUND = 799;

const navigation = document.querySelector(".navigation");
const navToogleButton = document.querySelector(".navigation__toogle-btn");
const header = document.querySelector(".header");

navToogleButton &&
    navToogleButton.addEventListener("click", () => {
        navigation && navigation.classList.toggle("navigation--active");
        header && header.classList.toggle("header--active");
    });

//LOGIC FOR DROPDOWNS IN NAVIGATION
const openDropDownButtons = document.querySelectorAll(".category-list__label");

openDropDownButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (window.innerWidth > WIDTH_SMALL_BOUND) return;

        button.classList.toggle("category-list__label--active");
    });
});

//CALCULATE padding for feedback
//we have header already
const headerClientRect = header && header.getBoundingClientRect();
const selectedGoods = document.querySelector(".selected-goods");
const selectedGoodsClientRect = selectedGoods && selectedGoods.getBoundingClientRect();
const selectedGoodsText = document.querySelector(".selected-goods__text");
const selectedGoodsTextClientRect = selectedGoodsText && selectedGoodsText.getBoundingClientRect();
const selectedGoodsCategores = document.querySelector(".selected-goods__list");
const selectedGoodsCategoresClientRect =
    selectedGoodsCategores && selectedGoodsCategores.getBoundingClientRect();

if (headerClientRect && selectedGoodsClientRect && selectedGoodsTextClientRect) {
    const distance = selectedGoodsTextClientRect.top - headerClientRect.bottom;

    //try catch meh :)
    const feedbackSlogan = document.querySelector(".feedback__slogan");
    const feedbackSloganClientRect = feedbackSlogan && feedbackSlogan.getBoundingClientRect();
    const feedbackButton = document.querySelector(".feedback__button");
    const feedbackButtonClientRect = feedbackButton && feedbackButton.getBoundingClientRect();

    // 10 is because of margin-bottom, it will be better to place content in wrapper but this is for future :)
    const heightOfFeebackContent =
        feedbackSloganClientRect.height + feedbackButtonClientRect.height + 10;

    const feedback = document.querySelector(".feedback");

    //For mobile
    if (window.innerWidth <= WIDTH_SMALL_BOUND) {
        const feedbackPaddingTop = distance - distance * 0.18 - heightOfFeebackContent;
        feedback.style.paddingTop = `${feedbackPaddingTop}px`;
    } else {
        //for larger screens
        const availableSpace =
            window.innerHeight -
            headerClientRect.height -
            heightOfFeebackContent -
            selectedGoodsTextClientRect.height -
            selectedGoodsCategoresClientRect.height;
        feedback.style.paddingTop = `${availableSpace / 2}px`;
        feedback.style.paddingBottom = `${availableSpace / 2}px`;
    }
}

//LOGIC FOR BACKGROUND OPACITY ON SCROll
let fisrtScroll = true;
let lastScrollPosition = 0;
const initialDistance =
    selectedGoods.getBoundingClientRect().top -
    header.getBoundingClientRect().bottom -
    (selectedGoods.getBoundingClientRect().top - header.getBoundingClientRect().bottom) / 4; //100% = opacity: 1
let lastDistance = initialDistance;

function fadeBackground(event) {
    if (event.currentTarget !== event.target) return;
    if (fisrtScroll) {
        fisrtScroll = false; //looks loke the first scroll is fired on page loading
        return;
    }

    const bgElem = document.querySelector(".background");
    if (bgElem) {
        let isScrollDown = true;
        if (lastScrollPosition - window.pageYOffset > 0) {
            isScrollDown = false;
        }
        lastScrollPosition = window.pageYOffset;

        //assume we have them from code above
        const headerClientRect = header.getBoundingClientRect();
        const selectedGoodsClientRect = selectedGoods.getBoundingClientRect();

        const newDistance = selectedGoodsClientRect.top - headerClientRect.bottom;

        if (newDistance > 0) {
            const deltaPercent = Math.abs((lastDistance - newDistance) / initialDistance);

            lastDistance = newDistance;

            const currentOpacity = parseFloat(getComputedStyle(bgElem).opacity);
            let newOpacity;

            if (isScrollDown) {
                newOpacity = currentOpacity - deltaPercent < 0 ? 0 : currentOpacity - deltaPercent;
            } else {
                newOpacity = currentOpacity + deltaPercent > 1 ? 1 : currentOpacity + deltaPercent;
            }

            bgElem.style.opacity = `${newOpacity}`;
        }
    }
}

document.addEventListener("scroll", fadeBackground);

//LOGIC FOR FEEDBACK POPUP
const popupBtnOpen = document.querySelector(".feedback__button");

popupBtnOpen &&
    popupBtnOpen.addEventListener("click", (event) => {
        event.preventDefault();

        const popup = document.querySelector(".write-us");
        const popupBtnClose = document.querySelector(".write-us__btn-close");

        if (popup && popupBtnClose) {
            popup.classList.add("write-us--active");
            document.body.style.overflow = "hidden";

            const closePopup = () => {
                popup.classList.remove("write-us--active");
                document.body.style.overflow = "auto";
            };

            popupBtnClose.addEventListener("click", closePopup);
            popup.addEventListener("click", (event) => {
                if (event.currentTarget == event.target) {
                    closePopup();
                }
            });
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    closePopup();
                }
            });
        }
    });

const validateFormInputs = (event) => {
    const input = event.target;
    const form = document.querySelector(".write-us__form");

    input.classList.remove("input-group__input--valid");
    input.classList.remove("input-group__input--invalid");
    document.querySelector(".write-us__submit").disabled = true;

    if (input.checked || input.value !== "") {
        if (input.matches(":invalid")) {
            input.classList.add("input-group__input--invalid");
        } else {
            input.classList.add("input-group__input--valid");
        }
    }

    if (form.matches(":valid")) {
        document.querySelector(".write-us__submit").disabled = false;
    }
};

const formInputs = Array.from(document.querySelectorAll(".input-group__input:not(textarea)"));
formInputs.forEach((input) => {
    input.addEventListener("change", validateFormInputs);
});
