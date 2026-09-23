import { cn } from "@/lib/utils"
import { interactiveRowClass, rowTitleHoverClass } from "@/components/ui/row-styles"

// 이미지가 없을 때 자리를 대신 채운다 (바깥은 blue-50, 안쪽으로 갈수록 blue-100)
const placeholderGradient =
  "radial-gradient(circle at center, var(--color-blue-100) 0%, var(--color-blue-50) 100%)"

export function PublicationRow({ title, authors, image, onClick }) {
  return (
    <li
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn(
        "flex gap-2.5 py-5 outline-none sm:gap-5",
        onClick && interactiveRowClass
      )}
    >
      {/* 모바일은 1:1 48px 고정, sm 이상은 4:3 높이 64px 고정 */}
      <div className="aspect-square w-12 shrink-0 self-start overflow-hidden rounded-base bg-surface-muted sm:aspect-[4/3] sm:w-[85.333px] sm:max-w-none">
        {image ? (
          /* 흰 배경 이미지는 뒤의 옅은 회색이 비쳐 보이게 곱하기로 합성한다 */
          <img
            src={image}
            alt=""
            className="size-full object-cover object-center mix-blend-multiply dark:mix-blend-normal"
          />
        ) : (
          <div aria-hidden className="size-full" style={{ backgroundImage: placeholderGradient }} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-start gap-1">
        <h3
          className={cn(
            "line-clamp-2 text-base/normal font-medium text-fg-strong sm:text-[20px]/normal",
            rowTitleHoverClass
          )}
        >
          {title}
        </h3>
        <p className="line-clamp-2 text-sm/normal font-normal text-fg-strong sm:text-[16px]/normal">
          {authors}
        </p>
      </div>
    </li>
  )
}
