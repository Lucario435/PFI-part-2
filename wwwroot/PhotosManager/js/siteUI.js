import { get as getPhotos, loadScript as lsPhotos } from "./views/listPhotos.js";
import { get as getCreatePhoto, loadScript as lsCreatePhoto } from "./views/createPhoto.js";
import { get as getPhotoDetail, loadScript as lsPhotoDetail } from "./views/photoDetail.js";
import { get as getDeletePhoto, loadScript as lsDeletePhoto } from "./views/deletePhoto.js";

//<span class="cmdIcon fa-solid fa-ellipsis-vertical"></span>
let contentScrollPosition = 0;
let sortType = "";
let keywords = "";
let loginMessage = "";
let Email = "";
let EmailError = "";
let CurrentFilter = "";
let passwordError = "";
let currentETag = "";
let currentViewName = "photosList";
let currentViewTitle = "";
let delayTimeOut = 200; // seconds
let currentElement = "";
// pour la pagination
let photoContainerWidth = 400;
let photoContainerHeight = 400;
let limit;
let limitPagination = 6;
let HorizontalPhotosCount;
let VerticalPhotosCount;
let offset = 0;
let currPage =0;

Init_UI();
function Init_UI() {
    getViewPortPhotosRanges();
    initTimeout(delayTimeOut, renderExpiredSession);
    installWindowResizeHandler();
    if (API.retrieveLoggedUser())
        renderPhotos();
    else
        renderLoginForm();
}

// pour la pagination
function getViewPortPhotosRanges() {
    // estimate the value of limit according to height of content
    VerticalPhotosCount = Math.round($("#content").innerHeight() / photoContainerHeight);
    HorizontalPhotosCount = Math.round($("#content").innerWidth() / photoContainerWidth);
    limit = (VerticalPhotosCount + 1) * HorizontalPhotosCount;
    // console.log("VerticalPhotosCount:", VerticalPhotosCount, "HorizontalPhotosCount:", HorizontalPhotosCount)
    offset = 0;
}
// pour la pagination
function installWindowResizeHandler() {
    var resizeTimer = null;
    var resizeEndTriggerDelai = 250;
    $(window).on('resize', function (e) {
        if (!resizeTimer) {
            $(window).trigger('resizestart');
        }
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            resizeTimer = null;
            $(window).trigger('resizeend');
        }, resizeEndTriggerDelai);
    }).on('resizestart', function () {
    }).on('resizeend', function () {
        if ($('#photosLayout') != null) {
            getViewPortPhotosRanges();
            if (currentViewName == "photosList")
                renderPhotosList();
        }
    });
}

////////////////////////////////////////////////////
//FUNCTIONS FOR FILTERS
function deselectAll(){
    $("i.fa-check").replaceWith($(`<i class="menuIcon fa fa-fw mx-2"></i>`));
}
function changeFilter(filter, element)
{
    //Avant de changer le fa check, si on reclique sur le même on retire le filtre
    if(CurrentFilter != filter)
    {
        //Changer la variable du filtre
        CurrentFilter = filter;
        currentElement = element;
        //Rendu de la page des images
        renderPhotos();

        //Check mis à jour
        deselectAll();
    }
    else
    {
        CurrentFilter = "";
        currentElement = "";
        deselectAll();
        renderPhotos();
    }
}
//FUNCTIONS FOR FILTERS
////////////////////////////////////////////////////

function attachCmd() {
    $('#loginCmd').on('click', renderLoginForm);
    $('#logoutCmd').on('click', logout);
    $('#listPhotosCmd').on('click', renderPhotos);
    $('#listPhotosMenuCmd').on('click', renderPhotos);
    $('#editProfilMenuCmd').on('click', renderEditProfilForm);
    $('#renderManageUsersMenuCmd').on('click', renderManageUsers);
    $('#editProfilCmd').on('click', renderEditProfilForm);
    $('#aboutCmd').on("click", renderAbout);
    $("#newPhotoCmd").on("click",()=>{renderCreatePhoto()});
    $("#sortByDateCmd").on("click",()=>{changeFilter("date","sortByDateCmd")});
    $("#sortByOwnersCmd").on("click",()=>{changeFilter("creator","sortByOwnersCmd")});
    $("#sortByLikesCmd").on("click",()=>{changeFilter("like","sortByLikesCmd")});
    $("#ownerOnlyCmd").on("click",()=>{changeFilter("own", "ownerOnlyCmd")});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Header management
function loggedUserMenu() {
    let loggedUser = API.retrieveLoggedUser();
    if (loggedUser) {
        let manageUserMenu = `
            <span class="dropdown-item" id="renderManageUsersMenuCmd">
                <i class="menuIcon fas fa-user-cog mx-2"></i> Gestion des usagers
            </span>
            <div class="dropdown-divider"></div>
        `;
        return `
            ${loggedUser.isAdmin ? manageUserMenu : ""}
            <span class="dropdown-item" id="logoutCmd">
                <i class="menuIcon fa fa-sign-out mx-2"></i> Déconnexion
            </span>
            <span class="dropdown-item" id="editProfilMenuCmd">
                <i class="menuIcon fa fa-user-edit mx-2"></i> Modifier votre profil
            </span>
            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="listPhotosMenuCmd">
                <i class="menuIcon fa fa-image mx-2"></i> Liste des photos
            </span>
            ${currentViewName == "photoList" ? 
            `<div class="dropdown-divider"></div>
            <span class="dropdown-item hfiltre" id="sortByDateCmd">
                ${currentElement == "sortByDateCmd" ? `<i class="menuIcon fa fa-check mx-2"></i>` : `<i class="menuIcon fa fa-fw mx-2"></i>`}
                <i class="menuIcon fa fa-calendar mx-2"></i>
                Photos par date de création
            </span>
            <span class="dropdown-item hfiltre" id="sortByOwnersCmd">
                ${currentElement == "sortByOwnersCmd" ? `<i class="menuIcon fa fa-check mx-2"></i>` : `<i class="menuIcon fa fa-fw mx-2"></i>`}
                <i class="menuIcon fa fa-users mx-2"></i>
                Photos par créateur
            </span>
            <span class="dropdown-item hfiltre" id="sortByLikesCmd">
                ${currentElement == "sortByLikesCmd" ? `<i class="menuIcon fa fa-check mx-2"></i>` : `<i class="menuIcon fa fa-fw mx-2"></i>`}
                <i class="menuIcon fa fa-user mx-2"></i>
                Photos les plus aimées
            </span>
            <span class="dropdown-item hfiltre" id="ownerOnlyCmd">
                ${currentElement == "ownerOnlyCmd" ? `<i class="menuIcon fa fa-check mx-2"></i>` : `<i class="menuIcon fa fa-fw mx-2"></i>`}
                <i class="menuIcon fa fa-user mx-2"></i>
                Mes photos
            </span>` : ""}
        `;
    }
    else
        return `
            <span class="dropdown-item" id="loginCmd">
                <i class="menuIcon fa fa-sign-in mx-2"></i> Connexion
            </span>`;
}
function viewMenu(viewName) {
    if (viewName == "photosList") {
        // todo
        return "";
    }
    else
        return "";
}
function connectedUserAvatar() {
    let loggedUser = API.retrieveLoggedUser();
    if (loggedUser)
        return `
            <div class="UserAvatarSmall" userId="${loggedUser.Id}" id="editProfilCmd" style="background-image:url('${loggedUser.Avatar}')" title="${loggedUser.Name}"></div>
        `;
    return "";
}
function refreshHeader() {
    UpdateHeader(currentViewTitle, currentViewName);
}
function UpdateHeader(viewTitle, viewName) {
    currentViewTitle = viewTitle;
    currentViewName = viewName;
    $("#header").empty();
    $("#header").append(`
        <span title="Liste des photos" id="listPhotosCmd"><img src="images/PhotoCloudLogo.png" class="appLogo"></span>
        <span class="viewTitle">${viewTitle} 
            <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
        </span>

        <div class="headerMenusContainer">
            <span>&nbsp</span> <!--filler-->
            <i title="Modifier votre profil"> ${connectedUserAvatar()} </i>         
            <div class="dropdown ms-auto dropdownLayout">
                <div data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
                </div>
                <div class="dropdown-menu noselect">
                    ${loggedUserMenu()}
                    ${viewMenu(viewName)}
                    <div class="dropdown-divider"></div>
                    <span class="dropdown-item" id="aboutCmd">
                        <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
                    </span>
                </div>
            </div>

        </div>
    `);
    if (sortType == "keywords" && viewName == "photosList") {
        $("#customHeader").show();
        $("#customHeader").empty();
        $("#customHeader").append(`
            <div class="searchContainer">
                <input type="search" class="form-control" placeholder="Recherche par mots-clés" id="keywords" value="${keywords}"/>
                <i class="cmdIcon fa fa-search" id="setSearchKeywordsCmd"></i>
            </div>
        `);
    } else {
        $("#customHeader").hide();
    }
    attachCmd();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Actions and command
async function login(credential) {
    loginMessage = "";
    EmailError = "";
    passwordError = "";
    Email = credential.Email;
    await API.login(credential.Email, credential.Password);
    if (API.error) {
        switch (API.currentStatus) {
            case 482: passwordError = "Mot de passe incorrect"; renderLoginForm(); break;
            case 481: EmailError = "Courriel introuvable"; renderLoginForm(); break;
            default: renderError("Le serveur ne répond pas"); break;
        }
    } else {
        let loggedUser = API.retrieveLoggedUser();
        if (loggedUser.VerifyCode == 'verified') {
            if (!loggedUser.isBlocked)
                renderPhotos();
            else {
                loginMessage = "Votre compte a été bloqué par l'administrateur";
                logout();
            }
        }
        else
            renderVerify();
    }
}
async function logout() {
    console.log('logout');
    await API.logout();
    renderLoginForm();
}
function isVerified() {
    let loggedUser = API.retrieveLoggedUser();
    return loggedUser.VerifyCode == "verified";
}
async function verify(verifyCode) {
    let loggedUser = API.retrieveLoggedUser();
    if (await API.verifyEmail(loggedUser.Id, verifyCode)) {
        renderPhotos();
    } else {
        renderError("Désolé, votre code de vérification n'est pas valide...");
    }
}
async function editProfil(profil) {
    if (await API.modifyUserProfil(profil)) {
        let loggedUser = API.retrieveLoggedUser();
        if (loggedUser) {
            if (isVerified()) {
                renderPhotos();
            } else
                renderVerify();
        } else
            renderLoginForm();

    } else {
        renderError("Un problème est survenu.");
    }
}
async function createProfil(profil) {
    if (await API.register(profil)) {
        loginMessage = "Votre compte a été créé. Veuillez prendre vos courriels pour réccupérer votre code de vérification qui vous sera demandé lors de votre prochaine connexion."
        renderLoginForm();
    } else {
        renderError("Un problème est survenu.");
    }
}
async function adminDeleteAccount(userId) {
    if (await API.unsubscribeAccount(userId)) {
        renderManageUsers();
    } else {
        renderError("Un problème est survenu.");
    }
}
async function deleteProfil() {
    let loggedUser = API.retrieveLoggedUser();
    if (loggedUser) {
        if (await API.unsubscribeAccount(loggedUser.Id)) {
            loginMessage = "Votre compte a été effacé.";
            logout();
        } else
            renderError("Un problème est survenu.");
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"));
}
function eraseContent() {
    $("#content").empty();
}
function saveContentScrollPosition() {
    contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
    $("#content")[0].scrollTop = contentScrollPosition;
}
function renderCreatePhoto(msg = undefined) {
    eraseContent();
    $("#content").html(getCreatePhoto(msg));
    lsCreatePhoto();
    UpdateHeader("Créer une photo", "createPhoto");
    initImageUploaders();
    initFormValidation();
    $("#formCPhoto").on("submit", function (e) {
        e.preventDefault();
        let loggedUser = API.retrieveLoggedUser();
        let datas = getFormData($("#formCPhoto"));
        let created = {
            OwnerId: loggedUser.Id, Title: datas.Title,
            Description: datas.Description, Image: datas.Photo,
            Shared: datas.shared ? true : false, Date: Math.floor(Date.now() / 1000)
        };
        // console.log("submit");
        console.log(created);
        createPhoto(created);
    })
    $("#abortCmd").on("click", function () {
        renderPhotosList();
    })
}
async function renderEditPhoto(msg = undefined, pid) {
    let r = await API.GetPhotos();
    if (r.data) {
        r.data.forEach(photo => {
            if (photo.Id == pid) {
                eraseContent();
                let loggedUser = API.retrieveLoggedUser();
                $("#content").html(getCreatePhoto(msg, photo, loggedUser));
                initFormValidation();
                initImageUploaders();
                lsCreatePhoto();
                UpdateHeader("Modifier la photo");
                $("#newPhotoCmd").hide();
                $("#formCPhoto").on("submit", function (e) {
                    e.preventDefault();
                    let loggedUser = API.retrieveLoggedUser();
                    let datas = getFormData($("#formCPhoto"));
                    let created = {
                        Id: photo.Id, OwnerId: photo.OwnerId, Title: datas.Title,
                        Description: datas.Description, Image: datas.Photo,
                        Shared: datas.shared ? true : false, Date: Math.floor(Date.now() / 1000)
                    };
                    API.UpdatePhoto(created).then((succ) => {
                        if (succ) renderPhotosList();
                        else renderError("Une erreur est survenue dans la mise à jour de la photo");
                    })
                })
                $("#abortCmd").on("click", function () {
                    renderPhotosList();
                })
            }
        });
    }
}
async function createPhoto(photoData) {
    if (photoData.Image == "") {
        renderCreatePhoto("Une image est obligatoire");
        return;
    }
    if (await API.CreatePhoto(photoData)) {
        renderPhotos();
    } else {
        renderCreatePhoto("Une erreur est survenue");
    }
}
async function renderError(message) {
    noTimeout();
    switch (API.currentStatus) {
        case 401:
        case 403:
        case 405:
            message = "Accès refusé...Expiration de votre session. Veuillez vous reconnecter.";
            await API.logout();
            renderLoginForm();
            break;
        case 404: message = "Ressource introuvable..."; break;
        case 409: message = "Ressource conflictuelle..."; break;
        default: if (!message) message = "Un problème est survenu...";
    }
    saveContentScrollPosition();
    eraseContent();

    $("#newPhotoCmd").hide();
    $("#content").append(
        $(`
            <div class="errorContainer">
                <b>${message}</b>
            </div>
            <hr>
            <div class="form">
                <button id="connectCmd" class="form-control btn-primary">Connexion</button>
            </div>
        `)
    );
    UpdateHeader("Problème", "error");
    $('#connectCmd').on('click', renderLoginForm);
    /* pour debug
     $("#content").append(
        $(`
            <div class="errorContainer">
                <b>${message}</b>
            </div>
            <hr>
            <div class="systemErrorContainer">
                <b>Message du serveur</b> : <br>
                ${API.currentHttpError} <br>

                <b>Status Http</b> :
                ${API.currentStatus}
            </div>
        `)
    ); */
}
function renderAbout() {
    timeout();
    saveContentScrollPosition();
    eraseContent();

    $("#newPhotoCmd").hide();
    $("#createContact").hide();
    $("#abort").show();
    $("#content").append(
        $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de photos</h2>
                <hr>
                <p>
                    Petite application de gestion de photos multiusagers à titre de démonstration
                    d'interface utilisateur monopage réactive.
                </p>
                <p>
                    Auteur: vos noms d'équipiers
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `))
    UpdateHeader("À propos...", "about");
}
async function renderPhotos() {
    timeout();
    showWaitingGif();
    $("#newPhotoCmd").show();
    $("#abort").hide();
    currPage = 0;
    let loggedUser = API.retrieveLoggedUser();
    if (loggedUser){
        renderPhotosList();
    }
    else {
        renderLoginForm();
    }
    UpdateHeader('Liste des photos', 'photosList')
}
function max(a,maxx){
    if(a > maxx)
        return maxx;
    return a;
}function min(a,minx){
    if(a > minx)
        return minx;
    return a;
}
function getCurrPage(){
    if(currPage < 0)
        currPage = 0;
    return currPage;
}
async function renderPhotosList() {
    eraseContent();
    let query = `?&limit=${limitPagination}&offset=${getCurrPage()}`;
    // alert(query);
    let r = await API.GetPhotos(query);
    let loggedUser = API.retrieveLoggedUser();
    // if(true){
    //     let query = `?Shared=true&OwnerId=${loggedUser.Id}&limit=${limitPagination}&offset=${getCurrPage()+1}`;
    //     let rx = await API.GetPhotos(query);
    //     if(rx.data){
    //         r.data.push(...rx.data);
    //     }
    // }
    
    let userdatas = {};
    let countPhotos =0;
    if (r.data) {
        r.data.forEach(photo => {
            let udata = undefined;
            udata = photo.Owner; //API.GetAccount(photo.OwnerId)
            userdatas[photo.Owner.Id] = udata;
            countPhotos+=1;
        });
        // console.log(r.data);
    }
    
    let nphotos = [];
    r.data.forEach(e => {
        reloadPhotoObj(e).then(s => {
            nphotos.push(s);
            $("#content").html(getPhotos(nphotos, userdatas, loggedUser, CurrentFilter, getCurrPage()));
            lsPhotos(renderPhotoDetail, renderDeletePhoto,renderEditPhoto);
            $("#editPhotoCmd").on("click", function () {
                let balise = $(this);
                let pid = balise.parent().attr("photoId")
                // console.log("ahhae");
                renderEditPhoto(undefined, pid);
            })
            $("#deletePhotoCmd").on("click", function () {
                let balise = $(this);
                let pid = balise.parent().attr("photoId")
                renderDeletePhoto(pid);
            })
            $("#content").on("click", "#editPhotoCmd", function (){
                let balise = $(this);
                let pid = balise.parent().attr("photoId")
                // console.log("ahhae");
                renderEditPhoto(undefined, pid);
            })
            $("#newPhotoCmd").show();
    
    let realcurrphoto = max(countPhotos,limitPagination);
    // console.log(realcurrphoto +" // "+limitPagination)
    if(realcurrphoto<limitPagination){
        $("#previousPage").show();
        $("#nextPage").hide();
        // console.log("hid");
    } else{
        $("#previousPage").show();
        $("#nextPage").show();
    } if(getCurrPage() == 0){
        $("#previousPage").hide();
        // console.log("is 0")
    }
        })
    })
    UpdateHeader("Liste des photos","photoList");
    
}
$("#content").on("click","#previousPage",function(){
    currPage += -1;
    renderPhotosList();
})
$("#content").on("click","#nextPage",function(){
    currPage += 1;
    renderPhotosList();
})
setInterval(() => {
    if(currentViewName == "photosList"){
        renderPhotosList();
    }
}, 30*1000);
async function reloadPhotoObj(photo) {
    let id = photo.Id;
    return new Promise(async resolve => {
        let likes = await API.loadLikesFor(id);
        let loggedUser = API.retrieveLoggedUser();
        if (likes != undefined) {
            let xlikes = likes;

            photo.likes = xlikes;
            photo.likesCount = xlikes.length;
            photo.likedBy = "";
            photo.likedByMe = undefined;

            let countLikeBy = 0;
            xlikes.forEach((element) => {
                let u = element.Owner;
                if(u.Id == loggedUser.Id){
                    photo.likedByMe=true;
                }
                if (u != undefined && countLikeBy <10) {
                    photo.likedBy += u.Name + "\n";
                    countLikeBy+=1;
                }
            });
            // console.log(photo);
            resolve(photo);
        } else {
            resolve(photo);
        }
    });
}
async function renderPhotoDetail(pid) {
    let r = await API.GetPhotos();
    if (r.data) {
        r.data.forEach(photo => {
            if (photo.Id == pid) {
                eraseContent();

                let loggedUser = API.retrieveLoggedUser();
                reloadPhotoObj(photo).then((nphoto) => {
                    $("#content").html(getPhotoDetail(nphoto, loggedUser));
                    lsPhotoDetail();
                    UpdateHeader("Détails","detail");
                    $("#newPhotoCmd").hide();
                    $("#clickLike").on("click", function () {
                        let likedByMe = $(this).attr("likedByMe");
                        let lbmId = $(this).attr("lbmId");
                        if(likedByMe == "true"){
                            API.DeleteLike(lbmId).then(()=>{renderPhotoDetail(pid)})
                        } else{
                            API.CreateLike({
                                OwnerId: loggedUser.Id,
                                PhotoId: pid,
                                Date: Math.floor(Date.now() / 1000)
                            }).then((success) => {
                                if (success != false) {
                                    // console.log("success like:" +success)
                                    // console.log(success);
                                    renderPhotoDetail(pid);
                                }
    
                            })
                        }
                        
                    })
                })
            }
        });
    }
}
async function renderDeletePhoto(pid) {
    let r = await API.GetPhotos();
    if (r.data) {
        r.data.forEach(photo => {
            if (photo.Id == pid) {
                eraseContent();
                let loggedUser = API.retrieveLoggedUser();
                $("#content").html(getDeletePhoto(photo));
                lsDeletePhoto();
                UpdateHeader("Supprimer la photo");
                $("#newPhotoCmd").hide();
                $("#formCPhoto").on("submit", function (e) {
                    e.preventDefault();
                    API.DeletePhoto(pid).then((succ) => {
                        if (succ) {
                            renderPhotosList();
                        } else renderError("Erreur dans la suppression");
                    });
                })
                $("#abortCmd").on("click", function () {
                    renderPhotosList();
                })
            }
        });
    }
}
function renderVerify() {
    eraseContent();

    $("#newPhotoCmd").hide();
    $("#content").append(`
        <div class="content">
            <form class="form" id="verifyForm">
                <b>Veuillez entrer le code de vérification de que vous avez reçu par courriel</b>
                <input  type='text' 
                        name='Code'
                        class="form-control"
                        required
                        RequireMessage = 'Veuillez entrer le code que vous avez reçu par courriel'
                        InvalidMessage = 'Courriel invalide';
                        placeholder="Code de vérification de courriel" > 
                <input type='submit' name='submit' value="Vérifier" class="form-control btn-primary">
            </form>
        </div>
    `);
    UpdateHeader("Vérification", "verify");
    initFormValidation(); // important do to after all html injection!
    $('#verifyForm').on("submit", function (event) {
        let verifyForm = getFormData($('#verifyForm'));
        event.preventDefault();
        showWaitingGif();
        verify(verifyForm.Code);
    });
}
function renderCreateProfil() {
    noTimeout();
    eraseContent();
    UpdateHeader("Inscription", "createProfil");
    $("#newPhotoCmd").hide();
    $("#content").append(`
        <br/>
        <form class="form" id="createProfilForm"'>
            <fieldset>
                <legend>Adresse ce courriel</legend>
                <input  type="email" 
                        class="form-control Email" 
                        name="Email" 
                        id="Email"
                        placeholder="Courriel" 
                        required 
                        RequireMessage = 'Veuillez entrer votre courriel'
                        InvalidMessage = 'Courriel invalide'
                        CustomErrorMessage ="Ce courriel est déjà utilisé"/>

                <input  class="form-control MatchedInput" 
                        type="text" 
                        matchedInputId="Email"
                        name="matchedEmail" 
                        id="matchedEmail" 
                        placeholder="Vérification" 
                        required
                        RequireMessage = 'Veuillez entrez de nouveau votre courriel'
                        InvalidMessage="Les courriels ne correspondent pas" />
            </fieldset>
            <fieldset>
                <legend>Mot de passe</legend>
                <input  type="password" 
                        class="form-control" 
                        name="Password" 
                        id="Password"
                        placeholder="Mot de passe" 
                        required 
                        RequireMessage = 'Veuillez entrer un mot de passe'
                        InvalidMessage = 'Mot de passe trop court'/>

                <input  class="form-control MatchedInput" 
                        type="password" 
                        matchedInputId="Password"
                        name="matchedPassword" 
                        id="matchedPassword" 
                        placeholder="Vérification" required
                        InvalidMessage="Ne correspond pas au mot de passe" />
            </fieldset>
            <fieldset>
                <legend>Nom</legend>
                <input  type="text" 
                        class="form-control Alpha" 
                        name="Name" 
                        id="Name"
                        placeholder="Nom" 
                        required 
                        RequireMessage = 'Veuillez entrer votre nom'
                        InvalidMessage = 'Nom invalide'/>
            </fieldset>
            <fieldset>
                <legend>Avatar</legend>
                <div class='imageUploader' 
                        newImage='true' 
                        controlId='Avatar' 
                        imageSrc='images/no-avatar.png' 
                        waitingImage="images/Loading_icon.gif">
            </div>
            </fieldset>
   
            <input type='submit' name='submit' id='saveUser' value="Enregistrer" class="form-control btn-primary">
        </form>
        <div class="cancel">
            <button class="form-control btn-secondary" id="abortCreateProfilCmd">Annuler</button>
        </div>
    `);
    $('#loginCmd').on('click', renderLoginForm);
    initFormValidation(); // important do to after all html injection!
    initImageUploaders();
    $('#abortCreateProfilCmd').on('click', renderLoginForm);
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');
    $('#createProfilForm').on("submit", function (event) {
        let profil = getFormData($('#createProfilForm'));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        event.preventDefault();
        showWaitingGif();
        createProfil(profil);
    });
}
async function renderManageUsers() {
    timeout();
    let loggedUser = API.retrieveLoggedUser();
    if (loggedUser.isAdmin) {
        if (isVerified()) {
            showWaitingGif();
            UpdateHeader('Gestion des usagers', 'manageUsers')
            $("#newPhotoCmd").hide();
            $("#abort").hide();
            let users = await API.GetAccounts();
            if (API.error) {
                renderError();
            } else {
                $("#content").empty();
                users.data.forEach(user => {
                    if (user.Id != loggedUser.Id) {
                        let typeIcon = user.Authorizations.readAccess == 2 ? "fas fa-user-cog" : "fas fa-user-alt";
                        let typeTitle = user.Authorizations.readAccess == 2 ? "Retirer le droit administrateur à" : "Octroyer le droit administrateur à";
                        let blockedClass = user.Authorizations.readAccess == -1 ? "class=' blockUserCmd cmdIconVisible fa fa-ban redCmd'" : "class='blockUserCmd cmdIconVisible fa-regular fa-circle greenCmd'";
                        let blockedTitle = user.Authorizations.readAccess == -1 ? "Débloquer $name" : "Bloquer $name";
                        let userRow = `
                        <div class="UserRow"">
                            <div class="UserContainer noselect">
                                <div class="UserLayout">
                                    <div class="UserAvatar" style="background-image:url('${user.Avatar}')"></div>
                                    <div class="UserInfo">
                                        <span class="UserName">${user.Name}</span>
                                        <a href="mailto:${user.Email}" class="UserEmail" target="_blank" >${user.Email}</a>
                                    </div>
                                </div>
                                <div class="UserCommandPanel">
                                    <span class="promoteUserCmd cmdIconVisible ${typeIcon} dodgerblueCmd" title="${typeTitle} ${user.Name}" userId="${user.Id}"></span>
                                    <span ${blockedClass} title="${blockedTitle}" userId="${user.Id}" ></span>
                                    <span class="removeUserCmd cmdIconVisible fas fa-user-slash goldenrodCmd" title="Effacer ${user.Name}" userId="${user.Id}"></span>
                                </div>
                            </div>
                        </div>           
                        `;
                        $("#content").append(userRow);
                    }
                });
                $(".promoteUserCmd").on("click", async function () {
                    let userId = $(this).attr("userId");
                    await API.PromoteUser(userId);
                    renderManageUsers();
                });
                $(".blockUserCmd").on("click", async function () {
                    let userId = $(this).attr("userId");
                    await API.BlockUser(userId);
                    renderManageUsers();
                });
                $(".removeUserCmd").on("click", function () {
                    let userId = $(this).attr("userId");
                    renderConfirmDeleteAccount(userId);
                });
            }
        } else
            renderVerify();
    } else
        renderLoginForm();
}
async function renderConfirmDeleteAccount(userId) {
    timeout();
    let loggedUser = API.retrieveLoggedUser();
    if (loggedUser) {
        let userToDelete = (await API.GetAccount(userId)).data;
        if (!API.error) {
            eraseContent();
            UpdateHeader("Retrait de compte", "confirmDeleteAccoun");
            $("#newPhotoCmd").hide();
            $("#content").append(`
                <div class="content loginForm">
                    <br>
                    <div class="form UserRow ">
                        <h4> Voulez-vous vraiment effacer cet usager et toutes ses photos? </h4>
                        <div class="UserContainer noselect">
                            <div class="UserLayout">
                                <div class="UserAvatar" style="background-image:url('${userToDelete.Avatar}')"></div>
                                <div class="UserInfo">
                                    <span class="UserName">${userToDelete.Name}</span>
                                    <a href="mailto:${userToDelete.Email}" class="UserEmail" target="_blank" >${userToDelete.Email}</a>
                                </div>
                            </div>
                        </div>
                    </div>           
                    <div class="form">
                        <button class="form-control btn-danger" id="deleteAccountCmd">Effacer</button>
                        <br>
                        <button class="form-control btn-secondary" id="abortDeleteAccountCmd">Annuler</button>
                    </div>
                </div>
            `);
            $("#deleteAccountCmd").on("click", function () {
                adminDeleteAccount(userToDelete.Id);
            });
            $("#abortDeleteAccountCmd").on("click", renderManageUsers);
        } else {
            renderError("Une erreur est survenue");
        }
    }
}
function renderEditProfilForm() {
    timeout();
    let loggedUser = API.retrieveLoggedUser();
    if (loggedUser) {
        eraseContent();
        UpdateHeader("Profil", "editProfil");
        $("#newPhotoCmd").hide();
        $("#content").append(`
            <br/>
            <form class="form" id="editProfilForm"'>
                <input type="hidden" name="Id" id="Id" value="${loggedUser.Id}"/>
                <fieldset>
                    <legend>Adresse ce courriel</legend>
                    <input  type="email" 
                            class="form-control Email" 
                            name="Email" 
                            id="Email"
                            placeholder="Courriel" 
                            required 
                            RequireMessage = 'Veuillez entrer votre courriel'
                            InvalidMessage = 'Courriel invalide'
                            CustomErrorMessage ="Ce courriel est déjà utilisé"
                            value="${loggedUser.Email}" >

                    <input  class="form-control MatchedInput" 
                            type="text" 
                            matchedInputId="Email"
                            name="matchedEmail" 
                            id="matchedEmail" 
                            placeholder="Vérification" 
                            required
                            RequireMessage = 'Veuillez entrez de nouveau votre courriel'
                            InvalidMessage="Les courriels ne correspondent pas" 
                            value="${loggedUser.Email}" >
                </fieldset>
                <fieldset>
                    <legend>Mot de passe</legend>
                    <input  type="password" 
                            class="form-control" 
                            name="Password" 
                            id="Password"
                            placeholder="Mot de passe" 
                            InvalidMessage = 'Mot de passe trop court' >

                    <input  class="form-control MatchedInput" 
                            type="password" 
                            matchedInputId="Password"
                            name="matchedPassword" 
                            id="matchedPassword" 
                            placeholder="Vérification" 
                            InvalidMessage="Ne correspond pas au mot de passe" >
                </fieldset>
                <fieldset>
                    <legend>Nom</legend>
                    <input  type="text" 
                            class="form-control Alpha" 
                            name="Name" 
                            id="Name"
                            placeholder="Nom" 
                            required 
                            RequireMessage = 'Veuillez entrer votre nom'
                            InvalidMessage = 'Nom invalide'
                            value="${loggedUser.Name}" >
                </fieldset>
                <fieldset>
                    <legend>Avatar</legend>
                    <div class='imageUploader' 
                            newImage='false' 
                            controlId='Avatar' 
                            imageSrc='${loggedUser.Avatar}' 
                            waitingImage="images/Loading_icon.gif">
                </div>
                </fieldset>

                <input type='submit' name='submit' id='saveUser' value="Enregistrer" class="form-control btn-primary">
                
            </form>
            <div class="cancel">
                <button class="form-control btn-secondary" id="abortEditProfilCmd">Annuler</button>
            </div>

            <div class="cancel">
                <hr>
                <button class="form-control btn-warning" id="confirmDelelteProfilCMD">Effacer le compte</button>
            </div>
        `);
        initFormValidation(); // important do to after all html injection!
        initImageUploaders();
        addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');
        $('#abortEditProfilCmd').on('click', renderPhotos);
        $('#confirmDelelteProfilCMD').on('click', renderConfirmDeleteProfil);
        $('#editProfilForm').on("submit", function (event) {
            let profil = getFormData($('#editProfilForm'));
            delete profil.matchedPassword;
            delete profil.matchedEmail;
            event.preventDefault();
            showWaitingGif();
            editProfil(profil);
        });
    }
}
function renderConfirmDeleteProfil() {
    timeout();
    let loggedUser = API.retrieveLoggedUser();
    if (loggedUser) {
        eraseContent();
        UpdateHeader("Retrait de compte", "confirmDeleteProfil");
        $("#newPhotoCmd").hide();
        $("#content").append(`
            <div class="content loginForm">
                <br>
                
                <div class="form">
                 <h3> Voulez-vous vraiment effacer votre compte? </h3>
                    <button class="form-control btn-danger" id="deleteProfilCmd">Effacer mon compte</button>
                    <br>
                    <button class="form-control btn-secondary" id="cancelDeleteProfilCmd">Annuler</button>
                </div>
            </div>
        `);
        $("#deleteProfilCmd").on("click", deleteProfil);
        $('#cancelDeleteProfilCmd').on('click', renderEditProfilForm);
    }
}
function renderExpiredSession() {
    noTimeout();
    loginMessage = "Votre session est expirée. Veuillez vous reconnecter.";
    logout();
    renderLoginForm();
}
function renderLoginForm() {
    noTimeout();
    eraseContent();
    UpdateHeader("Connexion", "Login");
    $("#newPhotoCmd").hide();
    $("#content").append(`
        <div class="content" style="text-align:center">
            <div class="loginMessage">${loginMessage}</div>
            <form class="form" id="loginForm">
                <input  type='email' 
                        name='Email'
                        class="form-control"
                        required
                        RequireMessage = 'Veuillez entrer votre courriel'
                        InvalidMessage = 'Courriel invalide'
                        placeholder="adresse de courriel"
                        value='${Email}'> 
                <span style='color:red'>${EmailError}</span>
                <input  type='password' 
                        name='Password' 
                        placeholder='Mot de passe'
                        class="form-control"
                        required
                        RequireMessage = 'Veuillez entrer votre mot de passe'
                        InvalidMessage = 'Mot de passe trop court' >
                <span style='color:red'>${passwordError}</span>
                <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
            </form>
            <div class="form">
                <hr>
                <button class="form-control btn-info" id="createProfilCmd">Nouveau compte</button>
            </div>
        </div>
    `);
    initFormValidation(); // important do to after all html injection!
    $('#createProfilCmd').on('click', renderCreateProfil);
    $('#loginForm').on("submit", function (event) {
        let credential = getFormData($('#loginForm'));
        event.preventDefault();
        showWaitingGif();
        login(credential);
    });
}
function getFormData($form) {
    const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
    var jsonObject = {};
    $.each($form.serializeArray(), (index, control) => {
        jsonObject[control.name] = control.value.replace(removeTag, "");
    });
    return jsonObject;
}

