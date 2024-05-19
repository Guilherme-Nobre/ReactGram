const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

// insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
    const { title } = req.body;
    const image = req.file.filename;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    // create a new photo
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    // if photo was created successfully, return data
    if (!newPhoto) {
        res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
        return;
    };

    res.status(201).json(newPhoto);
};

// remove a photo from DB
const deletePhoto = async (req, res) => {
    const { id } = req.params;

    const reqUser = req.user;

    try {
        const photo = await Photo.findById(id);

        // Verifique se a foto foi encontrada
        if (!photo) {
            res.status(404).json({ errors: ["Foto não encontrada."] });
            return;
        }

        // Verifique se a foto pertence ao usuário
        if (!photo.userId.equals(reqUser._id)) {
            res.status(422).json({ errors: ["A foto não pertence ao usuário."] });
            return;
        }

        // Remova a foto
        await Photo.findByIdAndDelete(photo._id);

        res.status(200).json({ id: photo._id, message: "Foto deletada com sucesso!" });
    } catch (error) {
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;
    }
};

// get all photos
const getAllPhotos = async (req, res) => {
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos);

};

// get user photos
const getUserPhotos = async (req, res) => {

    const { id } = req.params

    const photos = await Photo.find({ userId: id }).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos);

};

// get photo by id
const getPhotoById = async (req, res) => {

    const { id } = req.params;

    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    // check if photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;
    };

    res.status(200).json(photo);

};

// Update photo
const updatePhoto = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // check if photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;
    };

    // check if belongs to user
    if (!photo.userId.equals(reqUser._id)) {
        res.status(422).json({ errors: ["A foto não pertence ao usuário."] });
        return;
    };

    if (title) {
        photo.title = title;
    }

    // update photo
    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
};

// Like functionality
const likePhoto = async (req, res) => {
    const { id } = req.params;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // check if photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;
    };

    // check if user already liked the photo
    if (photo.likes.includes(reqUser._id)) {
        res.status(422).json({ errors: ["Você já curtiu essa foto."] });
        return;
    };

    // add like to photo
    photo.likes.push(reqUser._id);

    // update photo
    await photo.save();

    res.status(200).json({ photoId: id, userId: reqUser._id, message: "Foto curtida com sucesso!" });


};

// comment functionality
const commentPhoto = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    // check if photo exists
    if (!photo) {
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;
    };

    // put comment in the array comments
    const userComments = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    };

    photo.comments.push(userComments);

    await photo.save();

    res.status(200).json({
        comments: userComments,
        message: "Comentário adicionado com sucesso!",
    });
};

// search photos by title
const searchPhotos = async (req, res) => {
    const {q} = req.query;

    const photos = await Photo.find({ title: new RegExp(q, "i")}).exec();

    res.status(200).json(photos);
};

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
};