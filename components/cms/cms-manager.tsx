// components/cms/cms-manager.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Globe, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { RouterOutputs } from "@/lib/trpc/client";

type PageList = RouterOutputs["cms"]["listPages"];
type PostList = RouterOutputs["cms"]["listPosts"];

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

interface PageForm {
  title: string;
  slug: string;
  metaTitle: string;
  metaDesc: string;
  status: typeof STATUS_OPTIONS[number];
  content: string; // Simple textarea: markdown-like text, stored as paragraph blocks
}

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  status: typeof STATUS_OPTIONS[number];
  content: string;
}

// Convert plain text into paragraph blocks for storage.
function textToBlocks(text: string) {
  return text
    .split("\n\n")
    .filter((p) => p.trim())
    .map((p) => ({ type: "paragraph" as const, content: p.trim() }));
}

// Convert blocks back to plain text for editing.
function blocksToText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return (blocks as { type: string; content?: string }[])
    .filter((b) => b.type === "paragraph" && b.content)
    .map((b) => b.content)
    .join("\n\n");
}

const emptyPage = (): PageForm => ({ title: "", slug: "", metaTitle: "", metaDesc: "", status: "DRAFT", content: "" });
const emptyPost = (): PostForm => ({ title: "", slug: "", excerpt: "", status: "DRAFT", content: "" });

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface Props {
  initialPages: PageList;
  initialPosts: PostList;
}

export function CmsManager({ initialPages, initialPosts }: Props) {
  const [tab, setTab] = useState<"pages" | "posts">("pages");
  const [pageOpen, setPageOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [pageForm, setPageForm] = useState<PageForm>(emptyPage());
  const [postForm, setPostForm] = useState<PostForm>(emptyPost());

  const utils = trpc.useUtils();

  const { data: pages } = trpc.cms.listPages.useQuery(
    { publishedOnly: false },
    { initialData: initialPages, placeholderData: (prev) => prev }
  );

  const { data: posts } = trpc.cms.listPosts.useQuery(
    { publishedOnly: false },
    { initialData: initialPosts, placeholderData: (prev) => prev }
  );

  const createPage = trpc.cms.createPage.useMutation({
    onSuccess: () => { utils.cms.listPages.invalidate(); setPageOpen(false); setPageForm(emptyPage()); },
  });

  const deletePage = trpc.cms.deletePage.useMutation({
    onSuccess: () => utils.cms.listPages.invalidate(),
  });

  const createPost = trpc.cms.createPost.useMutation({
    onSuccess: () => { utils.cms.listPosts.invalidate(); setPostOpen(false); setPostForm(emptyPost()); },
  });

  const deletePost = trpc.cms.deletePost.useMutation({
    onSuccess: () => utils.cms.listPosts.invalidate(),
  });

  function pageField(key: keyof PageForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setPageForm((f) => {
        const next = { ...f, [key]: e.target.value };
        if (key === "title" && !f.slug) next.slug = slugify(e.target.value);
        return next;
      });
    };
  }

  function postField(key: keyof PostForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setPostForm((f) => {
        const next = { ...f, [key]: e.target.value };
        if (key === "title" && !f.slug) next.slug = slugify(e.target.value);
        return next;
      });
    };
  }

  function submitPage(e: React.FormEvent) {
    e.preventDefault();
    createPage.mutate({
      title: pageForm.title,
      slug: pageForm.slug,
      content: textToBlocks(pageForm.content),
      metaTitle: pageForm.metaTitle || null,
      metaDesc: pageForm.metaDesc || null,
      status: pageForm.status,
    });
  }

  function submitPost(e: React.FormEvent) {
    e.preventDefault();
    createPost.mutate({
      title: postForm.title,
      slug: postForm.slug,
      excerpt: postForm.excerpt || null,
      content: textToBlocks(postForm.content),
      status: postForm.status,
    });
  }

  const pageList = pages ?? initialPages;
  const postList = posts ?? initialPosts;

  const statusColor: Record<string, string> = {
    PUBLISHED: "text-green-700 bg-green-50",
    DRAFT: "text-zinc-600 bg-zinc-100",
    ARCHIVED: "text-zinc-400 bg-zinc-100",
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(["pages", "posts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? "border-zinc-900 text-zinc-900" : "border-transparent text-muted-foreground hover:text-zinc-700"
            }`}
          >
            {t === "pages" ? <Globe className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Pages */}
      {tab === "pages" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setPageOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> New page
            </Button>
          </div>
          <div className="divide-y rounded-lg border">
            {pageList.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">No pages yet.</p>
            )}
            {pageList.map((page) => (
              <div key={page.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium">{page.title}</p>
                  <p className="text-xs text-muted-foreground">/{page.slug} · Updated {formatDate(page.updatedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[page.status]}`}>
                    {page.status}
                  </span>
                  <a
                    href={`/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </a>
                  <button
                    onClick={() => { if (confirm("Delete this page?")) deletePage.mutate(page.id); }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {tab === "posts" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setPostOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> New post
            </Button>
          </div>
          <div className="divide-y rounded-lg border">
            {postList.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">No posts yet.</p>
            )}
            {postList.map((post) => (
              <div key={post.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground">
                    /blog/{post.slug}
                    {post.publishedAt ? ` · Published ${formatDate(post.publishedAt)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[post.status]}`}>
                    {post.status}
                  </span>
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </a>
                  <button
                    onClick={() => { if (confirm("Delete this post?")) deletePost.mutate(post.id); }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New page dialog */}
      <Dialog open={pageOpen} onOpenChange={(v) => { if (!v) { setPageOpen(false); setPageForm(emptyPage()); } }}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>New page</DialogTitle></DialogHeader>
          <form onSubmit={submitPage} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ptitle">Title *</Label>
                <Input id="ptitle" required value={pageForm.title} onChange={pageField("title")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pslug">Slug *</Label>
                <Input id="pslug" required value={pageForm.slug} onChange={pageField("slug")} placeholder="e.g. about" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pcontent">Content</Label>
              <Textarea id="pcontent" rows={8} value={pageForm.content} onChange={pageField("content")} placeholder="Use double line breaks to separate paragraphs." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pmetatitle">Meta title</Label>
                <Input id="pmetatitle" value={pageForm.metaTitle} onChange={pageField("metaTitle")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pstatus">Status</Label>
                <select id="pstatus" value={pageForm.status} onChange={pageField("status")} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setPageOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={createPage.isPending}>
                {createPage.isPending ? "Saving…" : "Save page"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* New post dialog */}
      <Dialog open={postOpen} onOpenChange={(v) => { if (!v) { setPostOpen(false); setPostForm(emptyPost()); } }}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>New post</DialogTitle></DialogHeader>
          <form onSubmit={submitPost} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="btitle">Title *</Label>
                <Input id="btitle" required value={postForm.title} onChange={postField("title")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bslug">Slug *</Label>
                <Input id="bslug" required value={postForm.slug} onChange={postField("slug")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bexcerpt">Excerpt</Label>
              <Input id="bexcerpt" value={postForm.excerpt} onChange={postField("excerpt")} placeholder="Short summary shown on the blog list" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bcontent">Content</Label>
              <Textarea id="bcontent" rows={8} value={postForm.content} onChange={postField("content")} placeholder="Use double line breaks to separate paragraphs." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bstatus">Status</Label>
              <select id="bstatus" value={postForm.status} onChange={postField("status")} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setPostOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={createPost.isPending}>
                {createPost.isPending ? "Saving…" : "Save post"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
