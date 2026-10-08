import type { APIRoute } from "astro";
import prisma from "@/lib/prisma";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "6", 10));
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return new Response(
      JSON.stringify({
        projects,
        total,
        totalPages,
        currentPage: page,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Failed to fetch projects:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch projects from database",
        details: error?.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, description, techStack, githubUrl, projectUrl } = body;

    if (!name || !description) {
      return new Response(
        JSON.stringify({ error: "Project name and description are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        techStack: Array.isArray(techStack) ? techStack.filter(Boolean) : [],
        githubUrl: githubUrl?.trim() || null,
        projectUrl: projectUrl?.trim() || null,
      },
    });

    return new Response(JSON.stringify({ success: true, project }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Failed to create project:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create project in database",
        details: error?.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
