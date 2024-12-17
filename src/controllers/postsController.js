import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModels.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"

export async function listarPosts (req, res) {
    const posts =  await getTodosPosts();
    res.status(200).json(posts);
}

export async function newPost(req, res) {
    const novoPost = req.body;

    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch(erro) {             
        console.error(erro.message);                
        res.status(500).json({"Erro":"Falha na requisição"});            
    }
}

export async function updatePost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`         // como expomos a pasta uploads, conseguimos acessar a imagem atraves desse link

    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)

        const post = {
            descricao: descricao,
            imgUrl: urlImagem,
            alt: req.body.alt
        }
        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch(erro) {             
        console.error(erro.message);                
        res.status(500).json({"Erro":"Falha na requisição"});            
    }
}

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: "",
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(postCriado);
    } catch(erro) {             
        console.error(erro.message);                
        res.status(500).json({"Erro":"Falha na requisição"});            
    }
}
