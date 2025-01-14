import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Masonry from 'react-masonry-css'
import { SRLWrapper } from "simple-react-lightbox"

import { Layout, PostCard, Pagination } from '../components/common'
import { MetaData } from '../components/common/meta'

/**
* Main index page (home page)
*
* Loads all posts from Ghost and uses pagination to navigate through them.
* The number of posts that should appear per page can be setup
* in /utils/siteConfig.js under `postsPerPage`.
*
*/
const Index = ({ data, location, pageContext }) => {
    const [overPost, setOverPost] = useState(undefined)
    const posts = data.allGhostPost.edges
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    }
    const srlOptions = {
        settings: {
            overlayColor: `#fff`,
            transitionSpeed: 200,
        },
        buttons: {
            showAutoplayButton: false,
            showDownloadButton: false,
        },
        thumbnails: {
            showThumbnails: false,
        },
        caption: {
            captionColor: `#15171A`,
        },
    }
    const hoverPost = function (id) {
        setOverPost(id)
    }

    return (
        <>
            <MetaData location={location} />
            <Layout isHome={true}>
                <div className="container">
                    <SRLWrapper
                        options={srlOptions}
                    >
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column">
                            {posts.sort(({ node: aNode }, { node: bNode }) => aNode.featured && -1 || bNode.featured && 1 || 0).map(({ node }) => (
                                <PostCard onHover={ hoverPost } hoverState={ (!overPost || node.id === overPost) ? `active` : `muted` } key={node.id} post={node} />
                            ))}
                        </Masonry>
                    </SRLWrapper>
                    <Pagination pageContext={pageContext} />
                </div>
            </Layout>
        </>
    )
}

Index.propTypes = {
    data: PropTypes.shape({
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    pageContext: PropTypes.object,
}

export default Index

// This page query loads all posts sorted descending by published date
// The `limit` and `skip` values are used for pagination
export const pageQuery = graphql`
  query GhostPostQuery($limit: Int!, $skip: Int!) {
    allGhostPost(
        sort: { order: DESC, fields: [title] },
        limit: $limit,
        skip: $skip
        filter: {slug: {ne: "data-schema"}}
    ) {
      edges {
        node {
          ...GhostPostFields
        }
      }
    }
  }
`
