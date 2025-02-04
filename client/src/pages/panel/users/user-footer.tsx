interface UserFooterProps {
  currPage: number;
  npages: number;
}

export const UserFooter = ({ currPage, npages }: UserFooterProps) => {
  return (
    <h3 className="text-primary/60 font-semibold text-center md:text-left w-full px-1">
      {`Page no : ${currPage} of ${npages}`}
    </h3>
  );
};
