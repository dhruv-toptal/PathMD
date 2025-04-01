import {
  AnnotationBody,
  ImageAnnotation,
  PopupProps,
} from "@annotorious/react";
import { ChangeEvent } from "react";

const COMMENTING = "commenting";

export function CommentPopup(props: PopupProps) {
  const { annotation, onCreateBody, onUpdateBody } = props;

  const onSave = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const updated = {
      purpose: COMMENTING,
      value: e.currentTarget.value,
    };

    const commentBody = findComment(annotation);
    if (commentBody) {
      onUpdateBody(commentBody, updated);
    } else {
      onCreateBody(updated);
    }
  };

  return (
    <div className="comment-popup">
      <textarea
        value={findComment(annotation)?.value || ""}
        onChange={(e) => onSave(e)}
      />
    </div>
  );
}

function findComment(annotation: ImageAnnotation): AnnotationBody | undefined {
  const purpose = COMMENTING;
  return annotation.bodies.find((body) => body.purpose === purpose);
}
