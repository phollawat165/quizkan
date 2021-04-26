import React from 'react';
import { Col, Row, Pagination } from 'react-bootstrap';

export type QuizPaginationProps = {
    page: number;
    pageLength: number;
    onPageChange: (e: React.MouseEvent<HTMLElement>, page: number) => any;
};

export const QuizPagination: React.FC<QuizPaginationProps> = ({
    page,
    pageLength,
    onPageChange,
}) => {
    return (
        <Row>
            <Col>
                <Pagination className="justify-content-center">
                    <Pagination.First
                        href="?page=1"
                        onClick={(e) => onPageChange(e, 1)}
                    />
                    <Pagination.Prev
                        disabled={page <= 0}
                        href={page > 0 ? `?page=${page}` : undefined}
                        onClick={(e) => onPageChange(e, page)}
                    />
                    <Pagination.Item disabled>{page + 1}</Pagination.Item>
                    <Pagination.Next
                        disabled={page + 2 > pageLength}
                        href={
                            page + 2 < pageLength
                                ? `?page=${page + 2}`
                                : undefined
                        }
                        onClick={(e) => onPageChange(e, page + 2)}
                    />
                    <Pagination.Last
                        href={`?page=${pageLength}`}
                        onClick={(e) => onPageChange(e, pageLength)}
                    />
                </Pagination>
            </Col>
        </Row>
    );
};

export default QuizPagination;
