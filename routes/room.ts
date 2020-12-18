import { Router, Request, Response } from "express";
const router: Router = Router();

router.get("", (req: Request, res: Response) => {});

router.post("", (req: Request, res: Response) => {});

router.patch("conclude", (req: Request, res: Response) => {});

router.patch("byline", (req: Request, res: Response) => {});

router.patch("toggle", (req: Request, res: Response) => {});

router.delete("", (req: Request, res: Response) => {});

router.delete("all", (req: Request, res: Response) => {});

export default router;
