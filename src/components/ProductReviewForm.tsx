import { useEffect, useState, type FormEvent } from 'react';
import { AlertCircle, Check, Star } from 'lucide-react';
import type { LanguageCode, ProductReview, SouvenirProduct } from '../types/store';
import { getProductTitle, getTranslations } from '../utils/i18n';
import {
  type ReviewFormErrors,
  createProductReview,
  validateReviewInput,
} from '../utils/storeLogic';

interface ProductReviewFormProps {
  productId: string;
  productTitle?: string;
  variantLabel?: string;
  products?: SouvenirProduct[];
  language: LanguageCode;
  onSubmitReview: (productId: string, review: ProductReview) => void;
}

export function ProductReviewForm({
  productId,
  productTitle,
  variantLabel,
  products,
  language,
  onSubmitReview,
}: ProductReviewFormProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(productId);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [author, setAuthor] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setSelectedProductId(productId);
    setRating(5);
    setHoverRating(null);
    setAuthor('');
    setLocation('');
    setComment('');
    setErrors({});
    setSubmitted(false);
  }, [productId]);

  const t = getTranslations(language);
  const activeProductId = selectedProductId || productId;
  const matchedProduct = products?.find((item) => item.id === activeProductId);
  const resolvedProductTitle = matchedProduct
    ? getProductTitle(matchedProduct, language)
    : productTitle;
  const resolvedVariantLabel =
    matchedProduct && matchedProduct.id !== productId
      ? (matchedProduct.variants[0]?.label ?? 'Standard Edition')
      : (variantLabel ?? matchedProduct?.variants[0]?.label ?? 'Standard Edition');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateReviewInput({
      author,
      location,
      rating,
      comment,
    });

    if (!validation.isValid) {
      setErrors({
        author: validation.errors.author ? t.pdp.authorError : undefined,
        rating: validation.errors.rating,
        comment: validation.errors.comment ? t.pdp.commentError : undefined,
      });
      setSubmitted(false);
      return;
    }

    const newReview = createProductReview({
      author,
      location,
      rating,
      comment,
      variantLabel: resolvedVariantLabel,
      fallbackLocation: t.pdp.verifiedCollector,
    });

    onSubmitReview(activeProductId, newReview);
    setAuthor('');
    setLocation('');
    setComment('');
    setRating(5);
    setHoverRating(null);
    setErrors({});
    setSubmitted(true);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      data-testid="pdp-review-form"
      data-product-id={activeProductId}
      className="rounded-xl border border-[#E4DFD6] bg-[#F2EFE9]/65 p-5 sm:p-6 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-lg font-semibold text-[#1A1917]">
            {t.pdp.writeReviewTitle}
          </h4>
          {resolvedProductTitle && (
            <p className="text-xs text-[#5E5A54] mt-0.5">
              {t.pdp.reviewingPiecePrefix} · <span className="font-medium text-[#1A1917]">{resolvedProductTitle}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-medium text-[#5E5A54] whitespace-nowrap shrink-0">
            {t.pdp.ratingLabel}:
          </span>
          <div
            role="radiogroup"
            aria-label={t.pdp.ratingLabel}
            className="inline-flex items-center shrink-0"
          >
            {[1, 2, 3, 4, 5].map((starValue) => {
              const activeLevel = hoverRating ?? rating;
              const filled = starValue <= activeLevel;
              return (
                <button
                  key={starValue}
                  type="button"
                  role="radio"
                  data-testid={`pdp-review-star-${starValue}`}
                  aria-checked={rating === starValue}
                  aria-label={`${starValue} ${t.pdp.starAriaSuffix}`}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => {
                    setRating(starValue);
                    setSubmitted(false);
                    if (errors.rating) {
                      setErrors((prev) => ({ ...prev, rating: undefined }));
                    }
                  }}
                  className="w-9 h-10 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center hover:bg-[#FAF8F5]/80 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A83226]"
                >
                  <Star
                    className={`w-4 h-4 transition-transform duration-150 motion-reduce:transition-none ${
                      filled
                        ? 'fill-[#A83226] text-[#A83226] scale-105'
                        : 'text-[#C8C0B4]'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          <span
            data-testid="pdp-review-rating-value"
            className="text-xs font-semibold text-[#1A1917] tabular-nums whitespace-nowrap shrink-0 min-w-[2.25rem] text-right"
          >
            {hoverRating ?? rating}/5
          </span>
        </div>
      </div>

      {products && products.length > 1 && (
        <div>
          <label
            htmlFor="pdp-review-product-select"
            className="block text-xs font-semibold text-[#1A1917] mb-1"
          >
            {t.pdp.selectProductLabel}
          </label>
          <select
            id="pdp-review-product-select"
            data-testid="pdp-review-product-select"
            value={activeProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setSubmitted(false);
            }}
            className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] focus:border-[#1A1917] focus:outline-none cursor-pointer"
          >
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {getProductTitle(item, language)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label
            htmlFor="pdp-review-author"
            className="block text-xs font-semibold text-[#1A1917] mb-1"
          >
            {t.pdp.authorLabel}
          </label>
          <input
            id="pdp-review-author"
            type="text"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              setSubmitted(false);
              if (errors.author) {
                setErrors((prev) => ({ ...prev, author: undefined }));
              }
            }}
            aria-invalid={Boolean(errors.author)}
            placeholder={t.pdp.authorPlaceholder}
            className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] focus:border-[#1A1917] focus:outline-none"
          />
          {errors.author && (
            <p className="mt-1 flex items-center gap-1 text-xs text-[#A83226]" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.author}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="pdp-review-location"
            className="block text-xs font-semibold text-[#1A1917] mb-1"
          >
            {t.pdp.locationLabel}
          </label>
          <input
            id="pdp-review-location"
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setSubmitted(false);
            }}
            placeholder={t.pdp.locationPlaceholder}
            className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] focus:border-[#1A1917] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="pdp-review-comment"
          className="block text-xs font-semibold text-[#1A1917] mb-1"
        >
          {t.pdp.commentLabel}
        </label>
        <textarea
          id="pdp-review-comment"
          rows={3}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setSubmitted(false);
            if (errors.comment) {
              setErrors((prev) => ({ ...prev, comment: undefined }));
            }
          }}
          aria-invalid={Boolean(errors.comment)}
          placeholder={t.pdp.commentPlaceholder}
          className="w-full px-3 py-2 rounded-lg border border-[#E4DFD6] bg-[#FAF8F5] text-sm text-[#1A1917] focus:border-[#1A1917] focus:outline-none resize-none"
        />
        {errors.comment && (
          <p className="mt-1 flex items-center gap-1 text-xs text-[#A83226]" role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{errors.comment}</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {submitted ? (
          <p
            data-testid="pdp-review-success"
            role="status"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2A5A3B]"
          >
            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.pdp.reviewSubmitted}</span>
          </p>
        ) : (
          <span className="text-[11px] text-[#5E5A54]">{resolvedVariantLabel}</span>
        )}

        <button
          type="submit"
          data-testid="pdp-review-submit"
          className="min-h-[40px] px-5 py-2 rounded-lg bg-[#1A1917] text-[#FAF8F5] text-xs font-semibold hover:bg-[#A83226] transition-colors cursor-pointer whitespace-nowrap"
        >
          {t.pdp.submitReview}
        </button>
      </div>
    </form>
  );
}
