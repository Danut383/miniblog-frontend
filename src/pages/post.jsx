import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../services/api";

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    getPost(id).then((res) => setPost(res.data));
  }, [id]);

  if (!post) return <p className="text-center text-gray-500">Cargando...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-gray-700 mt-4">{post.content}</p>
      </div>
    </div>
  );
}

export default Post;
