import Model from './model.js';
import UserModel from './user.js';
// import PhotoLikeModel from './photoLike.js';
import Repository from '../models/repository.js';
import Photo from './photo.js';

export default class PhotoLikeModel extends Model {
    constructor()
    {
        super();
        this.addField('OwnerId', 'string');     
        this.addField('PhotoId', 'string');
        this.addField('Date','integer');

        this.setKey("Date");
    }

    bindExtraData(instance) {
        instance = super.bindExtraData(instance);
        let usersRepository = new Repository(new UserModel());
        instance.Owner = usersRepository.get(instance.OwnerId);
        instance.OwnerName = instance.Owner.Name;
        
        let photoRep = new Repository(new Photo())
        instance.Photo = photoRep.get(instance.PhotoId);
        return instance;
    }
}