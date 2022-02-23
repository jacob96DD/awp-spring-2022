import { Link, redirect } from "remix";
import { useLoaderData } from "remix";
import db from "~/db/db.server";

export const loader = async function ({ params }) {
  const recipes = db.data.recipes.find((p) => p.id === params.recipesId);

  if (!recipes) {
    throw new Error("recipe not found");
  }
  return {
    recipes,
  };
};

export const action = async function ({ request, params }) {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    db.data.recipes = db.data.recipes.filter((p) => p.id !== params.recipesId);
    db.write();
    return redirect("/recipes");
  }
};

export default function Recipes() {
  const { recipes } = useLoaderData();

  return (
    <div>
      <div className="page-header">
        <h1>{recipes.title}</h1>
        <Link to=".." className="btn btn-reverse">
          Back
        </Link>
      </div>
      
      {recipes.list.map((recipe)=> (<p className="page-content">{recipe} </p>))}
      <p className="page-content">{recipes.body}</p>
      <div className="page-footer">
        <form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit" className="btn btn-delete">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
