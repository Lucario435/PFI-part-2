export function get(msg = undefined){
    return `
    <form class="form" id="formCPhoto">
        ${msg != undefined ? '<h4 style="color:red;">'+msg+'</h4>':"" }
        <fieldset>
        <legend>Informations</legend>
        <input type="text" class="form-control" placeholder="Titre" name="Title" />
        <textarea class="form-control" placeholder="Description" rows="4" name="Description"></textarea>
        <input type="checkbox" name="shared" />
        <label for="shared">Partagée</label>
        </fieldset>

        <fieldset>
        <legend>Image</legend>
        <div class='imageUploader'
        newImage='true'
        controlId='Photo'
        imageSrc='images/PhotoCloudLogo.png'
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