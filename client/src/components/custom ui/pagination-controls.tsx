import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "../ui/card";

interface PaginationControlsProps {
  currPage: number;
  nPage: number;
  nthClick: (pageNo: number) => void;
  prevClick: () => void;
  nextClick: () => void;
}

export const PaginationControls = ({
  currPage,
  nPage,
  nthClick,
  prevClick,
  nextClick,
}: PaginationControlsProps) => {
  return (
    <>
      {nPage > 1 && (
        <Card className="p-1 px-1.5">
          <Pagination>
            <PaginationContent>
              {currPage != 1 && (
                <>
                  <PaginationItem className="cursor-pointer">
                    <PaginationPrevious onClick={() => prevClick()} />
                  </PaginationItem>
                  <PaginationItem className="cursor-pointer">
                    <PaginationLink onClick={() => nthClick(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              {currPage != 1 && currPage != nPage && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {currPage != nPage && (
                <>
                  <PaginationItem className="cursor-pointer">
                    <PaginationLink onClick={() => nthClick(nPage)}>
                      {nPage}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem className="cursor-pointer">
                    <PaginationNext onClick={() => nextClick()} />
                  </PaginationItem>
                </>
              )}
            </PaginationContent>
          </Pagination>
        </Card>
      )}
    </>
  );
};
