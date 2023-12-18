

export function get(msg = undefined,EditPhoto = {}){
    let Title = EditPhoto.Title;
    let Description = EditPhoto.Description;
    let Shared = EditPhoto.Shared;
    let Image = EditPhoto.Image;
    // console.log(Image);
    return `
    <form class="form" id="formCPhoto">
        ${msg != undefined ? '<h4 style="color:red;">'+msg+'</h4><br>':"" }
        <fieldset>
        <legend>Informations</legend>
        <input type="text" class="form-control" placeholder="Titre" name="Title" value="${Title != undefined? Title:""}" />
        <textarea class="form-control" placeholder="Description" rows="4" name="Description">${Description != undefined? Description:""}</textarea>
        <input type="checkbox" name="shared" ${Shared != undefined ?(Shared == true? "checked":""):"" } />
        <label for="shared">Partagée</label>
        </fieldset>

        <fieldset>
        <legend>Image</legend>
        <div class='imageUploader'
        newImage='${Image != undefined? "false":"true"}'
        controlId='Photo'
        imageSrc='${Image != undefined? Image : "images/PhotoCloudLogo.png"}'
        waitingImage="images/Loading_icon.gif">
        </div>
        </fieldset>

        <input type='submit' name='submit' id='savePhotoCmd' value="Enregistrer" class="form-control btn-primary">
    </form>
    <div class="cancel">
    <button type="button" class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>;
    `
}
export function loadScript(){

}