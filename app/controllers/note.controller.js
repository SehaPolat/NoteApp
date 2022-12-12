const Note = require("../models/note.model.js");
//every route has its own request handler here complete with request validation and error handling
exports.create = (req, res)=> {
    if(!req.body.content){
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
    
    const note = new Note({
        title: req.body.title || "Untitled Note",
        content: req.body.content
    });

    note.save()
    .then(data=> {
        res.sendStatus(200);   // res code 200, note created. return code 200 added to all succesfull opperations
        res.send(data);
    }).catch(err=> {
        res.status(500).send({
            message: err.message || "Some error occured while creating note"
        });
    });
};

exports.findAll = (req, res)=> {
    Note.find()
    .then(notes=> {
        res.sendStatus(200);
        res.send(notes);
    }).catch(err=> {
        res.status(500).send({
            message: err.message || "Some error ocurred while fetching notes"
        });
    });
};

exports.findOne = async (req, res)=> {               // database scan is run async
    Note.findById(req.params.noteId)
    .then(note=> {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.sendStatus(200);
        res.send(note);
        await;
    }).catch(err=> {
        if(err.kind === "ObjectId") {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.noteId
        });
    });
};

exports.update = (req, res)=> {
    if(!req.body.content){
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    },{new: true})                                 //this line is used to return the modified version of the document to the then() function
    .then(note=> {
        if(!note) {
        return res.status(404).send({
            message: "Note not found with id " + req.params.noteId
        });
    }
    res.sendStatus(200);
    res.send(note);
    }).catch(err=> {
        if(err.kind === "ObjectId") {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        return res.status(500).send({
            message: "Error updating note with id" + req.params.noteId
        });
    });
};

exports.delete = (req, res)=> {
    Note.findByIdAndRemove(req.params.noteId)
    .then(note=> {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.sendStatus(200);
        res.send({message: "Note deleted succesfully!"});
    }).cathc(err=> {
        if(err.kind === "ObjectId" || err.name === "NotFound") {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.noteId
        });
    });
};

// fonksiyonların (req, res, next) parametrelerini inceledim. Next fonksiyonunun ne olduğunu ve nerelerde kullanılabileceğini anladığımı düşünüyorum
// bunun hakkında örnekler inceledim ve okuma yaptım, ancak bu kodda nerede nasıl bulundurmanın faydalı olacağını anlayamadım.
// kodum daha modüler olsaydı ve daha fazla helper function tanımlamış olsaydım etkili şekilde kullanabilirdim.
// error handling için bir helper function tanımplayıp, aynı uri üzerinde ardışık olarak bu fonksiyonları next parametresi ile bağlarsam
// işe yarar mı? Bu kod için aklıma sadece bu geliyor. Okuduğum kadarıyla çok güzel bir kullanım alanı admin yetkilerini yönetmek.

// function requireAdmin(req, res, next) {
//     if (!req.user || !req.user.admin) {
//       next(new Error("Permission denied."));
//       return;
//     }
//   
//     next();
//   }
//   
//   app.get('/top/secret', loadUser, requireAdmin, function(req, res) {
//     res.send('blahblahblah');
//   });

// buradaki gibi


// asenkron işlem yürütme ve promise verip işlem beklememe gibi olayları anladım. await modülünün de işlevini anladığımı düşünüyorum ama burda da
// next parametresi gibi nereye ekleyeceğimi bilemedim. Çünkü kod çok lineer gözüküyor. Eş zamanlı olarak yürütmesi gereken işlemler, veya
// performans anlamında bottleneck yaşanacak bi yer görmüyorum. Bundan dolayı async işlem yürütmenin nasıl bi faydası olacağını anlamadım.
// Aklıma gelen en iyi kullanım alanı database taraması yaparken kullanmak oldu (kullanılan tarama algoritmasına göre zaman hassasiyeti
// yüksek olabilir. Burda işlemin sonucunu beklemek yerine async verip dönecek sonucu promise etmek mantıklı olur.) bu yüzden
// findOne fonksiyonu içinde await modülü ile birlikte kullandım. (line 38)
